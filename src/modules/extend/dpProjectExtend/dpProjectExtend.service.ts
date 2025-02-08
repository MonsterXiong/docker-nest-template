import { Injectable } from '@nestjs/common';
import { DpMenuService } from 'src/modules/base/dpMenu';
import { DpMenuDetailService } from 'src/modules/base/dpMenuDetail';
import { DpProjectService } from 'src/modules/base/dpProject/dpProject.service';
import { DpProjectInfoService } from 'src/modules/base/dpProjectInfo';
import QueryConditionBuilder from 'src/utils/queryCondition';
import { DbService } from '../db';
import { DatabaseConfigDto } from 'src/shared/dto/database.dto';

@Injectable()
export class DpProjectExtendService {
  constructor(
    private readonly dpProjectService: DpProjectService,
    private readonly dpProjectInfoService: DpProjectInfoService,
    private readonly dpMenuService: DpMenuService,
    private readonly dpMenuDetailService: DpMenuDetailService,
    private readonly dbService: DbService,
  ) {}
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

  async getMenu(id) {
    const queryCondition =
      QueryConditionBuilder.getInstanceNoPage().buildEqualQuery(
        'bindProject',
        id,
      );
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
}
