import { Injectable } from '@nestjs/common';
import { DpMenuExtendService } from 'src/modules/extend/dpMenuExtend/dpMenuExtend.service';
import { CommonService } from 'src/modules/extend/common/common.service';
import {
  GenFeEnum,
  MENUT_TYPE_ENUM,
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
import { DbService } from '../db';
import { GenEnum } from 'src/enums/gen.enum';


// 定义接口和类型
// =======================================

/**
 * 代码生成策略接口
 */
interface GenStrategy {
  type: GenFeEnum;
  execute: () => Promise<any[]>;
}

/**
 * 项目代码结果类型
 */
interface ProjectCodeResult {
  fe: any[];
  be: any[];
}

/**
 * 菜单树构建配置
 */
interface TreeConfig {
  idKey: string;
  parentKey: string;
  childKey: string;
}

/**
 * 参数数据策略接口
 */
interface ParamsDataStrategy {
  getParamsData(id: string): Promise<any>;
  processData?(data: any): any;
}


// 工具函数
// =======================================
/**
 * 构建树形结构
 * @param list 列表数据
 * @param topId 顶级ID
 * @param config 树配置选项
 * @returns 树形结构
 */
function buildTree(
  list: any[],
  topId: string,
  config: TreeConfig = { idKey: 'id', parentKey: 'parentId', childKey: 'children' },
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

// 策略类
// =======================================

/**
 * 参数数据上下文类
 * 使用策略模式处理不同类型的参数数据获取
 */
class ParamsDataContext {
  private strategies: Record<GenFeEnum, ParamsDataStrategy> = {
    [GenFeEnum.MODULE]: {
      getParamsData: (id) => this.dpProjectExtendService.getTableAndColumnByProjectId(id),
    },
    [GenFeEnum.BASE_SERVICE]: {
      getParamsData: (id) => this.dpProjectExtendService.getTableAndColumnByProjectId(id),
    },
    [GenFeEnum.INTERFACE]: {
      getParamsData: (id) => this.dpProjectExtendService.getTableAndColumnByProjectId(id),
    },
    [GenFeEnum.PAGE]: {
      getParamsData: (id) => this.dpProjectExtendService.getMenu(id),
      processData: (data) => data.filter((item) => item.type === MENUT_TYPE_ENUM.PAGE),
    },
    [GenFeEnum.ROUTE]: {
      getParamsData: (id) => this.dpProjectExtendService.getMenu(id),
      processData: (data) => listToTree(data),
    },
    [GenFeEnum.CONFIG]: {
      getParamsData: (id) => this.dpProjectExtendService.getEnvConfig(id),
    },
    [GenFeEnum.EXTEND_SERVICE]: {
      getParamsData: () => null, // TODO: Implement getSwaggerService
    },
    [GenFeEnum.STORE]: {
      getParamsData: (id) => this.dpProjectExtendService.getStore(id),
    },
  };
  constructor(
    private dpProjectExtendService: DpProjectExtendService,
  ) { }


  /**
 * 获取参数数据
 * @param type 生成类型
 * @param id 项目或菜单ID
 * @returns 处理后的参数数据
 */
  async getParamsData(type: GenFeEnum, id: string): Promise<any> {
    const strategy = this.strategies[type];
    if (!strategy) {
      throw new Error(`不支持的类型: ${type}`);
    }
    const data = await strategy.getParamsData(id);
    return strategy.processData ? strategy.processData(data) : data;
  }
}


// 主服务类
// =======================================

/**
 * 代码生成服务
 * 提供代码生成相关的操作和数据查询
 */
@Injectable()
@ServiceMeta({
  displayName: '代码生成服务',
  description: '提供代码生成相关的操作和数据查询'
})
export class DpGenService {
  private paramsDataContext: ParamsDataContext;
  constructor(
    private moduleRef: ModuleRef,
    private readonly dpMenuExtendService: DpMenuExtendService,
    private readonly commonService: CommonService,
    private readonly dpProjectExtendService: DpProjectExtendService,
    private readonly dpTemplateService: DpTemplateService,
    private readonly dpTemplateExtendService: DpTemplateExtendService,
    private readonly dbService: DbService,
  ) {
    this.paramsDataContext = new ParamsDataContext(dpProjectExtendService);
  }

  // 模板测试相关方法
  // ---------------------------------------
  /**
 * 测试某个模板的运行函数
 * @param templateId 模板ID
 * @param menuId 菜单ID
 * @returns 模板运行结果
 */
  @Method({
    displayName: '测试页面数据',
    description: '测试指定模板和菜单的渲染结果',
    params: [
      { name: 'templateId', type: 'string', description: '模板ID', required: true },
      { name: 'menuId', type: 'string', description: '菜单ID', required: true }
    ],
    returnType: 'any',
    returnDescription: '模板渲染结果'
  })
  async testPageData(templateId: string, menuId: string): Promise<any> {
    const templateInfo = await this.dpTemplateService.findOne(templateId);
    const menuInfo = await this.dpMenuExtendService.findOne(menuId);
    const PROJECT_INFO = await this.dpProjectExtendService.getProjectInfo(
      menuInfo.bindProject,
    );
    return this.dpTemplateExtendService.runFunc(
      templateInfo.templateCode,
      {
        PROJECT_INFO,
        PARAMS: menuInfo,
      },
    );
  }

  // 项目相关代码生成方法
  // ---------------------------------------
  /**
 * 生成项目相关数据
 * @param id 项目ID
 * @param type 生成类型
 * @param res 响应对象
 * @returns 生成结果
 */
  @Method({
    displayName: '生成项目相关数据',
    description: '根据项目ID和类型生成相关代码数据',
    params: [
      { name: 'id', type: 'string', description: '项目ID', required: true },
      { name: 'type', type: 'GenFeEnum', description: '生成类型', required: true },
      { name: 'res', type: 'Response', description: '响应对象', required: true }
    ],
    returnType: 'any',
    returnDescription: '生成结果'
  })
  async genProjectRelData(id: string, type: GenFeEnum, res: any): Promise<any> {
    if (!id) {
      return '项目Id不存在';
    }
    const result = await this.getProjectRelData(id, type);
    return outputCode(res, result, type);
  }


  /**
 * 获取项目相关数据
 * @param id 项目ID
 * @param type 生成类型
 * @returns 项目相关数据
 */
  async getProjectRelData(id: string, type: GenFeEnum): Promise<any> {
    try {
      const projectInfo = await this.dpProjectExtendService.getProjectInfo(id);
      const isSingle = TYPE_MAP_SINGLE[type];
      const transCode = TYPE_MAP_CODE[type];
      const paramsData = await this.paramsDataContext.getParamsData(type, id);
      if (!paramsData) {
        console.log(`不存在paramsData----------${type}`);
        return [];
      }
      const result = this.commonService.getCode(
        projectInfo,
        paramsData,
        type,
        isSingle,
      );
      return format(result, isSingle, transCode);
    } catch (error) {
      console.error(`获取项目相关数据失败: ${error.message}`);
      throw error;
    }
  }

  async getProjectRelData1(id: string, type: GenFeEnum,isGen:GenEnum,res: any): Promise<any> {
    try {
      const projectInfo = await this.dpProjectExtendService.getProjectInfo(id);
      const isSingle = TYPE_MAP_SINGLE[type];
      const transCode = TYPE_MAP_CODE[type];
      const paramsData = await this.paramsDataContext.getParamsData(type, id);
      if (!paramsData) {
        console.log(`不存在paramsData----------${type}`);
        return [];
      }
      const result = this.commonService.getCode(
        projectInfo,
        paramsData,
        type,
        isSingle,
      );
      const data =format(result, isSingle, transCode);
      if(GenEnum.GEN == isGen){
        return outputCode(res, data, type);
      }else{
        res.status(200).json({
          statusCode:200,
          code: 200,
          message: '请求成功',
          timestamp: new Date().toISOString(),
          data,
        });
        return
      }
    } catch (error) {
      console.error(`获取项目相关数据失败: ${error.message}`);
      throw error;
    }
  }



  /**
   * 生成前端项目
   * @param id 项目ID
   * @returns 项目数据
   */
  @Method({
    displayName: '生成前端项目',
    description: '根据项目ID生成前端项目代码',
    params: [
      { name: 'id', type: 'string', description: '项目ID', required: true }
    ],
    returnType: 'object',
    returnDescription: '前端和后端代码数据'
  })
  async genFeProject(id: string): Promise<ProjectCodeResult> {
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
  /**
  * 获取前端项目数据
  * @param id 项目ID
  * @returns 前端和后端代码数据
  */
  async getFeProject(id: string): Promise<any> {
    const genRequest = [];
    for (const key in GenFeEnum) {
      genRequest.push(this.getProjectRelData(id, GenFeEnum[key]));
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






  /**
   * 获取项目代码数据(V2版本)
   * @param id 项目ID
   * @returns 前端和后端代码数据对象
   */
  @Method({
    displayName: '获取项目代码数据',
    description: '根据项目ID获取所有相关代码数据',
    params: [
      { name: 'id', type: 'string', description: '项目ID', required: true }
    ],
    returnType: 'object',
    returnDescription: '前端和后端代码数据对象'
  })
  async getFeProjectV2(id: string): Promise<ProjectCodeResult> {
    try {
      // 使用策略模式处理不同类型的代码生成
      const genStrategies = this.createGenStrategies(id);
      const results = await Promise.all(
        Object.values(genStrategies).map(strategy => strategy.execute())
      );

      // 将结果分类为前端和后端代码
      return this.categorizeResults(results);
    } catch (err) {
      throw new Error(`获取项目代码数据失败: ${err.message}`);
    }
  }

  /**
   * 创建不同类型代码生成的策略对象
   * @param projectId 项目ID
   * @returns 策略对象集合
   */
  private createGenStrategies(projectId: string): Record<string, GenStrategy> {
    return Object.values(GenFeEnum).reduce((strategies, type) => {
      strategies[type] = {
        type,
        execute: async () => this.getProjectRelData(projectId, type)
      };
      return strategies;
    }, {});
  }

  /**
   * 将生成结果分类为前端和后端代码
   * @param results 生成结果
   * @returns 分类后的前端和后端代码
   */
  private categorizeResults(results: any[]): { fe: any[], be: any[] } {
    const typeOrder = Object.values(GenFeEnum);
    const feTypes = [
      GenFeEnum.PAGE,
      GenFeEnum.ROUTE,
      GenFeEnum.CONFIG,
      GenFeEnum.STORE,
      GenFeEnum.BASE_SERVICE,
      GenFeEnum.EXTEND_SERVICE
    ];

    return {
      fe: results.filter((_, index) => feTypes.includes(typeOrder[index])).flat(),
      be: results.filter((_, index) => !feTypes.includes(typeOrder[index])).flat()
    };
  }

  /**
 * 生成项目
 */
  async genProject(): Promise<void> {
    // 获取项目信息
    // 开始调用四大流程,并返回对应信息来更新项目或项目详情数据
  }


  // 项目准备工作相关方法
  // ---------------------------------------
  /**
 * 处理准备工作
 * @param id 项目ID
 * @param type 处理类型
 * @returns 处理结果
 */
  @Method({
    displayName: '处理项目准备工作',
    description: '根据项目ID和类型处理项目准备工作',
    params: [
      { name: 'id', type: 'string', description: '项目ID', required: true },
      { name: 'type', type: 'string', description: '处理类型', required: true }
    ],
    returnType: 'any',
    returnDescription: '处理结果'
  })
  async handlePrepare(id: string, type: string): Promise<any> {
    //  获取当前项目以及所有子级
    const projectList = await this.dpProjectExtendService.getProject();
    const currentProjectList = findTreeByArr(projectList, id)
    const projectInfo = listToTree(currentProjectList)[0]

    switch (type) {
      case 'git':
        return await handleGit(projectInfo);
      case 'jenkins':
        return await this.handleJenkins(projectInfo);
      case 'buildScript':
        return await this.handleBuildScript(projectInfo);
      case 'homeNav':
        return await this.handleHomeNav(projectInfo);
      default:
        return projectInfo;
    }
  }

  /**
   * 处理Git信息
   * @param projectInfo 项目信息
   */
  async handleGit(projectInfo: any): Promise<any> {
    // 实现Git处理逻辑
  }

  /**
   * 处理Jenkins信息
   * @param projectInfo 项目信息
   */
  async handleJenkins(projectInfo: any): Promise<any> {
    // 调用jenkins模块
  }

  /**
   * 处理打包脚本信息
   * @param projectInfo 项目信息
   */
  async handleBuildScript(projectInfo: any): Promise<any> {
    // 调用打包脚本生成即可
  }

  /**
  * 处理首页导航信息
  * @param projectInfo 项目信息
  */
  async handleHomeNav(projectInfo: any): Promise<any> {
    // 调用nav
  }





  // 数据库和测试相关方法
  // ---------------------------------------

  // 菜单生成工具
  // 后期要考虑使用元数据体系还是数据库 =>考虑 数据库和元数据体系其实是一个东西 =>选择表和表字段  那么项目需要绑定数据库或者所属元数据体系
  // 首选第一步：根据类型 =>1. 选择项目 || 数据库 || 元数据体系
  /**
* 测试方法
*/
  @Method({
    displayName: '测试方法',
    description: '测试数据库表和字段获取',
    returnType: 'any',
    returnDescription: '测试结果'
  })
  async test(): Promise<any> {
    // 临时页面的生成，可以考虑持久化以及统计
    const params: any = {
      type: "project",// project // metaDb
      value: "1", // 
      menuInfo: {
        code: '',
        type: 'page',
        menuDetail: {
          configParam: {}
        }
      },
      dbInfo: {
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "123456",
        database: 'development_platform'
      }

    }

    const data = await this.getTable(params)
    return data
  }

  /**
   * 获取数据库表和字段
   * @param params 参数
   * @returns 表和字段数据
   */
  async getTable(params: any): Promise<any> {
    switch (params.type) {
      case "db":
        return await this.dbService.getNoSysTableList(params.dbInfo);
      case "project":
        return await this.dpProjectExtendService.getTableAndColumnByProjectId(params.value);
      case "metaDb":
        // 将数据体系转为原始的表字段结构
        return [];
      default:
        return [];
    }
  }


  // 组装成menu以及menuDetail的菜单结构
  // 菜单信息  => menu:{,menuDetail:{}}

  // 生成页面需要的元素： 1.菜单信息，2.菜单详情 3.菜单详情依赖与数据库表以及表字段
  /**
  * 生成页面
  */
  genPage() { }

  // 接下来考虑解耦操作以及版本操作
  // 要考虑最原始的template以及templateData还有版本问题
  // 临时生成工具 =>需要具备的东西
  // tempGenId
  // tempName
  // Gentype:'前端页面' | '前端接口' | '前端路由' | '前端配置' | '前端状态' | '前端枚举' | '前端其它'
  // 要根据类型做JSON校验
  // 类型信息：例如service、menu的组装数据
  // 版本信息
  // typeInfo
  // 模板的配置信息
  // configParam:''
  // 
  genService() { }


  // 首先如果基于EJS模板作为底层依赖的话，我们可以考虑前置守卫-后置守卫，是否异步等，增强扩展语法
  // 比如在使用renderEngine引擎时，我们可以增强include语法，注入function方法
  // 统一在前置守卫进行数据处理
  // 通义在后置守卫进行字符串拼接

  // 菜单相关代码生成方法
  // ---------------------------------------
  /**
 * 获取菜单相关数据
 * @param id 菜单ID
 * @param type 生成类型
 * @returns 菜单相关数据
 */
  async getMenuRelData(id: string, type: GenFeEnum): Promise<any> {
    if (!id) {
      return '菜单Id不存在';
    }
    let menu: any = await this.dpMenuExtendService.findOne(id);

    if (!menu && type == GenFeEnum.PAGE && menu.type == MENUT_TYPE_ENUM.MODULE) {
      console.log('当前为模块');
      return [];
    }

    if (menu.type == MENUT_TYPE_ENUM.MODULE && type == GenFeEnum.ROUTE) {
      // 查询整棵树
      let menuData = await this.dpProjectExtendService.getMenu(
        menu.bindProject,
      );
      menuData = menuData.sort((a, b) => (a.sysSort > b.sysSort ? 1 : -1));
      menuData = findTreeByArr(menuData, id)
      menu = buildTree(menuData, id);
    }
    const projectInfo = await this.dpProjectExtendService.getProjectInfo(
      menu.bindProject,
    );
    const isSingle = TYPE_MAP_SINGLE[type];
    return this.commonService.getCode(
      projectInfo,
      [menu],
      type,
      isSingle,
    );
  }


  /**
 * 生成菜单相关数据
 * @param id 菜单ID
 * @param type 生成类型
 * @param res 响应对象
 * @returns 生成结果
 */
  @Method({
    displayName: '生成菜单相关数据',
    description: '根据菜单ID和类型生成相关代码数据',
    params: [
      { name: 'id', type: 'string', description: '菜单ID', required: true },
      { name: 'type', type: 'GenFeEnum', description: '生成类型', required: true },
      { name: 'res', type: 'Response', description: '响应对象', required: true }
    ],
    returnType: 'any',
    returnDescription: '生成结果'
  })
  async genMenuRelData(id: string, type: GenFeEnum, res: any): Promise<any> {
    const result = await this.getMenuRelData(id, type);
    const transCode = TYPE_MAP_CODE[type];
    const isSingle = TYPE_MAP_SINGLE[type];
    return outputCode(res, format(result, isSingle, transCode), type);
  }
}
