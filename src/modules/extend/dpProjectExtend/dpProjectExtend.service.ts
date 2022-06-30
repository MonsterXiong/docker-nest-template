import { Injectable } from '@nestjs/common';
import { DpProjectService } from 'src/modules/base/dpProject/dpProject.service';
import {
  DpProjectInfo,
  DpProjectInfoService,
} from 'src/modules/base/dpProjectInfo';
import QueryConditionBuilder from 'src/utils/queryCondition';
import { DbService } from '../db';
import { DatabaseConfigDto } from 'src/shared/dto/database.dto';
import { DpEnvConfig, DpEnvConfigService } from 'src/modules/base/dpEnvConfig';
import { listToTree, TreeNode } from 'src/utils/treeTool';
import { DpMenuExtendService } from 'src/modules/extend/dpMenuExtend/dpMenuExtend.service';
import { DpProject } from 'src/modules/base/dpProject';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DpMenu } from 'src/modules/base/dpMenu';
import { DpStoreService } from 'src/modules/base/dpStore';
@Injectable()
export class DpProjectExtendService {
  constructor(
    private readonly dpProjectService: DpProjectService,
    private readonly dpProjectInfoService: DpProjectInfoService,
    private readonly dpMenuExtendService: DpMenuExtendService,
    private readonly dbService: DbService,
    private readonly dpEnvConfigService: DpEnvConfigService,
    private readonly dpStoreService: DpStoreService,

    @InjectRepository(DpProject)
    private readonly dpProjectRepository: Repository<DpProject>,
  ) {}

  async getProject() {
    const data = await this.dpProjectRepository
      .createQueryBuilder('a')
      .leftJoinAndMapOne(
        'a.projectInfo',
        DpProjectInfo,
        'b',
        'b.bind_project = a.id AND b.sys_is_del IS NOT NULL',
      )
      .getMany();
    return data;
  }

  async getProjectWithProjectInfo(id) {
    //   console.time('start')
    //  const data = await this.dpProjectRepository
    //   .createQueryBuilder('a')
    //   .leftJoinAndMapOne('a.projectInfo',DpProjectInfo,'b','b.bind_project = a.id AND b.sys_is_del IS NOT NULL')
    //   .leftJoinAndMapMany('a.menuList',DpMenu,'c','c.bind_project = a.id AND c.sys_is_del IS NOT NULL')
    //   .leftJoinAndMapMany('a.envList',DpEnvConfig,'d','d.bind_project = a.id AND d.sys_is_del IS NOT NULL')
    //   .where('a.id = :id',{id}).getOne()
    //   console.timeEnd('start')
    //   return data
  }

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
    const queryCondition = QueryConditionBuilder.getInstanceNoPage()
      .buildEqualQuery('bindProject', id)
      .buildAscSort('sysSort');

    const { data } = await this.dpEnvConfigService.queryList(queryCondition);

    return listToTree(data);
  }

  async getMenu(id) {
    const queryCondition =
      QueryConditionBuilder.getInstanceNoPage().buildEqualQuery(
        'bindProject',
        id,
      );
    const { data } = await this.dpMenuExtendService.queryList(queryCondition);
    return data;
  }
  async getStore(id) {
    const queryCondition = QueryConditionBuilder.getInstanceNoPage()
      .buildEqualQuery('bindProject', id)
      .buildAscSort('sysSort');

    const { data } = await this.dpStoreService.queryList(queryCondition);

    return data;
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
