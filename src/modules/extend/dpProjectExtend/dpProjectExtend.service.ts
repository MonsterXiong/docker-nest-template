import { Injectable } from '@nestjs/common';
import { DpMenuService } from 'src/modules/base/dpMenu';
import { DpMenuDetailService } from 'src/modules/base/dpMenuDetail';
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
@Injectable()
export class DpProjectExtendService {
  constructor(
    private readonly dpProjectService: DpProjectService,
    private readonly dpProjectInfoService: DpProjectInfoService,
    private readonly dpMenuService: DpMenuService,
    private readonly dpMenuDetailService: DpMenuDetailService,
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
    const { data: menuList } =
      await this.dpMenuService.queryList(queryCondition);
    const menuDetailList = await this.dpMenuDetailService.findAll();
    return menuList.map((item) => {
      const menuDetail =
        menuDetailList.find(
          (menuDetailItem) => menuDetailItem.bindMenu == item.id,
        ) || {};
      return {
        ...item,
        menuDetail,
      };
    });
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
    const pageData = this.commonService.getCode(projectInfo, menuList, 'page')

    // todo:生成完页面需要生成路由数据=>还需要完善
    const routeData = this.commonService.getCode(projectInfo, listToTree(menuList), 'route')

    // 生成env数据 todo:config数据=>还需要完善
    const envConfigData = this.commonService.getCode(projectInfo, envConfigList, 'config',true)

    // 生成后端接口
    const interfaceData = this.commonService.getCode(projectInfo, dbList, 'interface')
    const moduleData = this.commonService.getCode(projectInfo, dbList, 'module',true)

    // todo:生成枚举

    const page = format(pageData)
    const db = format(interfaceData, 'tableName')
    const moduleEntry = format(moduleData, '')
    const route = format(routeData)
    const envConfig = format(envConfigData, '')
    // 需要清洗路径和数据
    return {
      pageData: page,
      interfaceData: db,
      moduleData: moduleEntry,
      routeData: route,
      envConfigData: envConfig,
      // param: {
      //   projectInfo,
      //   envConfigList,
      //   menuList,
      // },
    }

  }


}

function format(data, key = 'code') {
  const result = []
  data.forEach(item => {
    if (item?.children?.length) {
      item.children.forEach(childItem => {
        result.push(formatData(childItem, item[key]))
      })
    } else {
      result.push(formatData(item, item[key]))
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
