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
import { DpMenu,  } from 'src/modules/base/dpMenu';
import { DpStore, DpStoreService } from 'src/modules/base/dpStore';
import { DpMenuDetail,  } from 'src/modules/base/dpMenuDetail';
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
  ) { }

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

    // 根据项目id删除菜单
    async deleteMenuByProjectId(id,req) {
      const data: any = await this.dpProjectRepository
      .createQueryBuilder('a')
      .leftJoinAndMapMany(
        'a.menuList',
        DpMenu,
        'b',
        'b.bind_project = a.id AND b.sys_is_del IS NOT NULL'
      )
      .where('a.id = :id', { id })
      .getOne();

      const {  menuList } = data
      const menuIds = menuList.map(item => item.id)
       // 删除菜单以及菜单详情
       return await this.dpMenuExtendService.deleteBatch(menuIds, req)
    }

  // 删除项目及项目相关的数据
  async deleteProjectById(id, req) {
    const data: any = await this.dpProjectRepository
      .createQueryBuilder('a')
      .leftJoinAndMapMany(
        'a.projectInfo',
        DpProjectInfo,
        'b',
        'b.bind_project = a.id AND b.sys_is_del IS NOT NULL'
      )
      .leftJoinAndMapMany(
        'a.menuList',
        DpMenu,
        'c',
        'c.bind_project = a.id AND c.sys_is_del IS NOT NULL'
      )
      .leftJoinAndMapMany(
        'a.storeList',
        DpStore,
        'e',
        'e.bind_project = a.id AND e.sys_is_del IS NOT NULL'
      ).leftJoinAndMapMany(
        'a.configList',
        DpEnvConfig,
        'f',
        'f.bind_project = a.id AND f.sys_is_del IS NOT NULL'
      )
      .where('a.id = :id', { id })
      .getOne();

    const { projectInfo, menuList,  storeList, configList } = data
    const projectInfoIds = projectInfo.map(item => item.id)
    const menuIds = menuList.map(item => item.id)
    const storeIds = storeList.map(item => item.id)
    const configIds = configList.map(item => item.id)


    return await Promise.all([
      // 删除项目
      this.dpProjectService.delete(id, req),
      // 删除项目详情
      this.dpProjectInfoService.deleteBatch(projectInfoIds, req),
      // 删除菜单以及菜单详情
      this.dpMenuExtendService.deleteBatch(menuIds, req),
      // 删除全局状态
      this.dpStoreService.deleteBatch(storeIds, req),
      // 删除配置项
      this.dpEnvConfigService.deleteBatch(configIds, req),
    ])
  }
}
