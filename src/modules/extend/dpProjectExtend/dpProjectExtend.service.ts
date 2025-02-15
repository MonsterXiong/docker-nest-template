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
import { listToTree,TreeNode  } from 'src/utils/treeTool';

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

  async getEnvConfig(id):Promise<TreeNode[]>{
    const queryCondition =
    QueryConditionBuilder.getInstanceNoPage().buildEqualQuery(
      'bindProject',
      id,
    ).buildAscSort('sysSort');;

    const { data} = await this.dpEnvConfigService.queryList(queryCondition);
    
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
    console.time('start')
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
    console.timeEnd('start')

    // 生成前端
    const pageData = this.commonService.getCode(projectInfo, menuList, 'page')
    // 生成后端
    const dbData = this.commonService.getCode(projectInfo, dbList, 'interface')
    // 生成后端module，根据dbList
    const envConfigData = this.commonService.getCode(projectInfo, envConfigList, 'config')
    // console.log(envConfigList.filter(item=>item.type=='env'),'projectEnvCOnfig');
    
    return {
      // pageData,
      // dbData,
      envConfigData,
      // param: {
      //   projectInfo,
      //   envConfigList,
      //   menuList,
      // },
    }

    // 开始生成

    // 生成menuData
    // 生成page

    // 生成service
    // 生成枚举

    // 生成配置文件

    // 生成package.json
  }


}
