import { Injectable } from '@nestjs/common';
import { DpProjectService } from 'src/modules/base/dpProject/dpProject.service';
import { DpProjectInfoService } from 'src/modules/base/dpProjectInfo';
import QueryConditionBuilder from 'src/utils/queryCondition';
import { DbService } from '../db';
import { DatabaseConfigDto } from 'src/shared/dto/database.dto';
import { DpEnvConfigService } from 'src/modules/base/dpEnvConfig';
import { CommonService } from 'src/modules/extend/common/common.service';
import { listToTree, TreeNode } from 'src/utils/treeTool';
import * as changeCase from 'change-case'
import path from 'path';
import { DpMenuExtendService } from 'src/modules/extend/dpMenuExtend/dpMenuExtend.service';
@Injectable()
export class DpProjectExtendService {
  constructor(
    private readonly dpProjectService: DpProjectService,
    private readonly dpProjectInfoService: DpProjectInfoService,
    private readonly dpMenuExtendService: DpMenuExtendService,
    private readonly dbService: DbService,
    private readonly dpEnvConfigService: DpEnvConfigService,
    private readonly commonService: CommonService,

  ) { }

  async getDbConfigByProjectId(id): Promise<DatabaseConfigDto> {
    const project = await this.getProjectInfo(id);
    if (!project?.projectInfo) {
      return null;
    }
    const { dbHost, dbUser, dbPassword, dbPort, dbName } = project.projectInfo;
    return {
      host: dbHost,
      port: Number(dbPort),
      user: dbUser,
      password: dbPassword,
      database: dbName,
      type: 'mysql',
    };
  }

  async getProjectInfo(id) {
    const project = await this.dpProjectService.findOne(id);
    if (!project) {
      return null;
    }
    const projectInfo = await this.dpProjectInfoService.findOneByParam({
      bindProject: id,
    });
    return { ...project, projectInfo };
  }

  async getEnvConfig(id): Promise<TreeNode[]> {
    const queryCondition =
      QueryConditionBuilder.getInstanceNoPage().buildEqualQuery(
        'bindProject',
        id,
      ).buildAscSort('sysSort');;

    const { data } = await this.dpEnvConfigService.queryList(queryCondition);

    return listToTree(data)
  }
  async getMenu(id) {
    const queryCondition =
      QueryConditionBuilder.getInstanceNoPage().buildEqualQuery(
        'bindProject',
        id,
      )
    const { data} = await this.dpMenuExtendService.queryList(queryCondition);
    return data
  }

  // 根据项目id获取数据库信息
  async getTableByProjectId(id) {
    const dbConfig = await this.getDbConfigByProjectId(id);
    return this.dbService.getAllTables(dbConfig);
  }

  // 根据项目id获取数据库表及字段所有信息
  async getTableAndColumnByProjectId(id) {
    const dbConfig = await this.getDbConfigByProjectId(id);
    return this.dbService.getTableList(dbConfig);
  }


  async genProject(id) {
    const [projectInfo, envConfigList, menuList, dbList] = await Promise.all([
      // 获取项目信息
      this.getProjectInfo(id),
      // 获取项目配置信息
      this.getEnvConfig(id),
      // 获取菜单信息以及菜单详情信息
      this.getMenu(id),
      // 获取数据库信息
      this.getTableAndColumnByProjectId(id)
    ])
    // 生成前端
    // const pageData = this.commonService.getCode(projectInfo, menuList, TYPE_MAP.PAGE,TYPE_MAP_SINGLE.PAGE)
    
    // // todo:生成完页面需要生成路由数据=>还需要完善
    // const routeData = this.commonService.getCode(projectInfo, listToTree(menuList), TYPE_MAP.ROUTE,TYPE_MAP_SINGLE.ROUTE)

    // // 生成env数据 todo:config数据=>还需要完善
    // const envConfigData = this.commonService.getCode(projectInfo, envConfigList, TYPE_MAP.CONFIG,TYPE_MAP_SINGLE.CONFIG)
    // 生成基础接口
    // const serviceData = this.commonService.getCode(projectInfo, dbList, TYPE_MAP.BASE_SERVICE,TYPE_MAP_SINGLE.BASE_SERVICE)
    // 生成扩展接口
    // getgroups
    const extendServiceList = await this.commonService.getSwaggerService()
    const extendServiceData = this.commonService.getCode(projectInfo, extendServiceList, TYPE_MAP.EXTEND_SERVICE,TYPE_MAP_SINGLE.EXTEND_SERVICE)
    // 生成后端接口
    // const interfaceData = this.commonService.getCode(projectInfo, dbList, TYPE_MAP.INTERFACE,TYPE_MAP_SINGLE.INTERFACE)
    // const moduleData = this.commonService.getCode(projectInfo, dbList, TYPE_MAP.MODULE,TYPE_MAP_SINGLE.MODULE)

    // todo:生成枚举
    // const page = format(pageData,TYPE_MAP_SINGLE.PAGE)
    // const db = format(interfaceData,TYPE_MAP_SINGLE.INTERFACE, 'tableName')
    // const moduleEntry = format(moduleData,TYPE_MAP_SINGLE.MODULE, '')
    // const route = format(routeData,TYPE_MAP_SINGLE.ROUTE)
    // const envConfig = format(envConfigData,TYPE_MAP_SINGLE.CONFIG, '')
    // const service = format(serviceData,TYPE_MAP_SINGLE.BASE_SERVICE, 'tableName')
    const extendService = format(extendServiceData,TYPE_MAP_SINGLE.EXTEND_SERVICE, 'serviceName')
    // 需要清洗路径和数据
    return {
      extendService
      // pageData: page,
      // service
      // interfaceData: db,
      // moduleData: moduleEntry,
      // routeData: route,
      // envConfigData: envConfig,
      // param: {
      //   projectInfo,
      //   envConfigList,
      //   menuList,
      // },
    }

  }


}

const TYPE_MAP  = {
  PAGE:'page',
  ROUTE:'route',
  CONFIG:'config',
  INTERFACE:'interface',
  MODULE:'module',
  BASE_SERVICE:'base_service',
  EXTEND_SERVICE:'extend_service',
}

const TYPE_MAP_SINGLE = {
  PAGE:false,
  ROUTE:false,
  CONFIG:true,
  INTERFACE:false,
  MODULE:true,
  BASE_SERVICE:false,
  EXTEND_SERVICE:false
}

function format(data,isSingle, key = 'code') {
  const result = []
  data.forEach(item => {
    // 如果templateCode为空，在这一块会报错
    if (isSingle) {
      result.push(formatData(item, item[key]))
    } else {
      if(item?.children?.length){
        item.children.forEach(childItem => {
          result.push(formatData(childItem, item[key]))
        })
      }
    }
  })
  return result
}

function formatData(item, name) {
  const Code = name ? changeCase.pascalCase(name) : ''
  const code = name ? changeCase.camelCase(name) : ''
  let filePath = item.filePath.replaceAll('{Code}', Code).replaceAll('{code}', code)
  if (item.fileExt) {
    filePath += `.${item.fileExt}`
  }
  return {
    content: item.code,
    filePath: path.join(filePath)
  }
}
