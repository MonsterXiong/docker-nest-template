import { Injectable } from '@nestjs/common';
import { DpMenuExtendService } from 'src/modules/extend/dpMenuExtend/dpMenuExtend.service';
import { CommonService } from 'src/modules/extend/common/common.service';
import {
  GenTypeMapEnum,
  TYPE_MAP_CODE,
  TYPE_MAP_SINGLE,
} from 'src/enums/genTypeMap.enum';
import { DpProjectExtendService } from '../dpProjectExtend/dpProjectExtend.service';
import { DpTemplateService } from 'src/modules/base/dpTemplate';
import { DpTemplateExtendService } from '../dpTemplateExtend/dpTemplateExtend.service';
import { outputCode } from 'src/utils/outputCode';
import { listToTree } from 'src/utils/treeTool';
import { format } from './dbGen.utils';
import { ModuleRef } from '@nestjs/core';
import { handleGit } from 'src/utils/handleGit';
import { findTreeByArr } from 'src/utils/findTreeByArr';
import { Method, ServiceMeta } from 'src/decorators/method.decorators';

function buildTree(
  list,
  topId,
  config = { idKey: 'id', parentKey: 'parentId', childKey: 'children' },
) {
  const { idKey, parentKey, childKey } = config;
  const map = new Map();

  list.forEach((item) => {
    item[childKey] = [];
    map.set(item[idKey], item);
  });

  list.forEach((item) => {
    if (map.has(item[parentKey])) {
      map.get(item[parentKey])[childKey].push(item);
    }
  });

  return map.get(topId);
}

@Injectable()
@ServiceMeta({
  displayName: '菜单服务',
  description: '提供菜单相关的操作和数据查询'
})
export class DpGenService {
  constructor(
    private moduleRef: ModuleRef,
    private readonly dpMenuExtendService: DpMenuExtendService,
    private readonly commonService: CommonService,
    private readonly dpProjectExtendService: DpProjectExtendService,
    private readonly dpTemplateService: DpTemplateService,
    private readonly dpTemplateExtendService: DpTemplateExtendService,
  ) {}

  // 测试某个templateModule的运行函数
  // 测试菜单页面的运行函数
  async testPageData(templateId, menuId) {
    const templateInfo = await this.dpTemplateService.findOne(templateId);
    const menuInfo = await this.dpMenuExtendService.findOne(menuId);
    const PROJECT_INFO = await this.dpProjectExtendService.getProjectInfo(
      menuInfo.bindProject,
    );
    const result = this.dpTemplateExtendService.runFunc(
      templateInfo.templateCode,
      {
        PROJECT_INFO,
        PARAMS: menuInfo,
      },
    );
    return result;
  }
  
  async genProjectRelData(id, type, res) {
    if (!id) {
      return '项目Id不存在';
    }
    const result = await this.getProjectRelData(id, type);
    return outputCode(res, result, type);
  }

  async getMenuRelData(id, type) {
    if (!id) {
      return '菜单Id不存在';
    }
    let menu: any = await this.dpMenuExtendService.findOne(id);

    if (!menu && type == GenTypeMapEnum.PAGE && menu.type == 'module') {
      console.log('当前为模块');
      return [];
    }

    if (menu.type == 'module' && type == GenTypeMapEnum.ROUTE) {
      // 应该查出整棵树
      let menuData = await this.dpProjectExtendService.getMenu(
        menu.bindProject,
      );
      menuData = menuData.sort((a, b) => (a.sysSort > b.sysSort ? 1 : -1));
      menuData = findTreeByArr(menuData,id)
      menu = buildTree(menuData, id);
    }
    const projectInfo = await this.dpProjectExtendService.getProjectInfo(
      menu.bindProject,
    );
    const IS_SINGLE = TYPE_MAP_SINGLE[type];
    const result = this.commonService.getCode(
      projectInfo,
      [menu],
      type,
      IS_SINGLE,
    );
    return result;
  }

  @Method({
    displayName: '获取菜单关联数据',
    description: '获取菜单及其关联的权限、角色等数据',
    returnType: 'object',
    returnDescription: '菜单关联数据对象'
  })
  async genMenuRelData(id, type, res) {
    const result = await this.getMenuRelData(id, type);
    const TRANS_CODE = TYPE_MAP_CODE[type];
    const IS_SINGLE = TYPE_MAP_SINGLE[type];
    return outputCode(res, format(result, IS_SINGLE, TRANS_CODE), type);
  }

  async getProjectRelData(id, type) {
    const projectInfo = await this.dpProjectExtendService.getProjectInfo(id);
    const IS_SINGLE = TYPE_MAP_SINGLE[type];
    const TRANS_CODE = TYPE_MAP_CODE[type];
    let paramsData = null;
    if (
      [
        GenTypeMapEnum.MODULE,
        GenTypeMapEnum.BASE_SERVICE,
        GenTypeMapEnum.INTERFACE,
      ].includes(type)
    ) {
      paramsData =
        await this.dpProjectExtendService.getTableAndColumnByProjectId(id);
    } else if ([GenTypeMapEnum.PAGE, GenTypeMapEnum.ROUTE].includes(type)) {
      paramsData = await this.dpProjectExtendService.getMenu(id);
    } else if (type === GenTypeMapEnum.CONFIG) {
      paramsData = await this.dpProjectExtendService.getEnvConfig(id);
    } else if (type === GenTypeMapEnum.EXTEND_SERVICE) {
      // paramsData = await this.commonService.getSwaggerService()
    } else if (type === GenTypeMapEnum.STORE) {
      paramsData = await this.dpProjectExtendService.getStore(id);
    }
    if (type === GenTypeMapEnum.ROUTE) {
      paramsData = listToTree(paramsData);
    }
    if (type === GenTypeMapEnum.PAGE) {
      paramsData = paramsData.filter((item) => item.type == 'page');
    }
    if (!paramsData) {
      console.log(`不存在paramsData----------${type}`);
      return [];
    }
    const result = this.commonService.getCode(
      projectInfo,
      paramsData,
      type,
      IS_SINGLE,
    );
    return format(result, IS_SINGLE, TRANS_CODE);
  }
  // 通过项目id生成项目数据
  async genFeProject(id) {
    const projectData = await this.getFeProject(id);
    // sql文件 以及插入指定数据库
    // zip解压到相对文件夹
    // 解压前端目录
    // 前端数据生成 =>拼接前端目录
    // 解压后端目录
    // 后端数据生成 =>拼接后端目录
    // return outputCode(res, projectData.fe, 'project');
    return projectData
  }
  // 通过项目id获取项目数据
  async getFeProject(id) {
    const genRequest = [];
    for (const key in GenTypeMapEnum) {
      genRequest.push(this.getProjectRelData(id, GenTypeMapEnum[key]));
    }
    const [
      pageList,
      routeList,
      envConfigList,
      serviceList,
      extendServiceList,
      interfaceList,
      moduleList,
    ] = await Promise.all(genRequest);

    // 生成env数据 todo:config数据=>还需要完善
    // todo:生成枚举
    return {
      fe: [
        ...pageList,
        ...routeList,
        ...envConfigList,
        ...serviceList,
        ...extendServiceList,
      ],
      be: [...interfaceList, ...moduleList],
    };
  }

  async genProject() {
    // 获取项目信息
    // 开始调用四大流程,并返回对应信息来更新项目或项目详情数据
  }

  async handlePrepare(id, type) {
    //  应该是获取当前项目以及所有子级
    const projectList = await this.dpProjectExtendService.getProject();
    const currentProjectList = findTreeByArr(projectList,id)
    const projectInfo = listToTree(currentProjectList)[0]
    if (type == 'git') {
      return await handleGit(projectInfo);
    } else if (type == 'jenkins') {
      return await this.handleJenkins(projectInfo);
    } else if (type == 'buildScript') {
      return await this.handleBuildScript(projectInfo);
    } else if (type == 'homeNav') {
      return await this.handleHomeNav(projectInfo);
    }
    return projectInfo
  }

  // 返回git信息
  async handleGit(projectInfo) {
    
  }

  // 返回jenkins信息
  async handleJenkins(projectInfo) {
    // 调用jenkins模块
  }

  // 返回打包脚本信息
  async handleBuildScript(projectInfo) {
    // 调用打包脚本生成即可
  }

  // 返回首页导航信息
  async handleHomeNav(projectInfo) {
    // 调用nav
  }

}
