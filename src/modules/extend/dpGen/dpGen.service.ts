import { Injectable } from '@nestjs/common';
import { DpMenuExtendService } from 'src/modules/extend/dpMenuExtend/dpMenuExtend.service';
import { CommonService } from 'src/modules/extend/common/common.service';
import { GenTypeMapEnum, GEN_TYPE_CONFIG } from 'src/enums/genTypeMap.enum';
import { DpProjectExtendService } from '../dpProjectExtend/dpProjectExtend.service';
import { DpTemplateService } from 'src/modules/base/dpTemplate';
import { DpTemplateExtendService } from '../dpTemplateExtend/dpTemplateExtend.service';
import { outputCode } from 'src/utils/outputCode';
import { listToTree } from 'src/utils/treeTool';
import { formatByType, CodeItem, FormattedFile } from './dbGen.utils';
import { ModuleRef } from '@nestjs/core';

// 定义数据适配器接口
interface IDataAdapter {
  getParamsData(projectId: string): Promise<any>;
  processData(data: any): any;
}
// 定义生成结果类型
interface GenerationResult {
  fe: any[];
  be: any[];
}


@Injectable()
export class DpGenService {
   // 数据适配器映射
   private readonly dataAdapters: Record<GenTypeMapEnum, IDataAdapter>;
  constructor(
    private moduleRef:ModuleRef,
    private readonly dpMenuExtendService: DpMenuExtendService,
    private readonly commonService: CommonService,
    private readonly dpProjectExtendService: DpProjectExtendService,
    private readonly dpTemplateService: DpTemplateService,
    private readonly dpTemplateExtendService: DpTemplateExtendService

  ) { 
    // 初始化数据适配器
    this.dataAdapters = this.initDataAdapters();
  }

  /**
   * 初始化各类型的数据适配器
   */
  private initDataAdapters(): Record<GenTypeMapEnum, IDataAdapter> {
    return {
      [GenTypeMapEnum.MODULE]: {
        getParamsData: (projectId: string) => this.dpProjectExtendService.getTableAndColumnByProjectId(projectId),
        processData: (data: any) => data
      },
      [GenTypeMapEnum.BASE_SERVICE]: {
        getParamsData: (projectId: string) => this.dpProjectExtendService.getTableAndColumnByProjectId(projectId),
        processData: (data: any) => data
      },
      [GenTypeMapEnum.INTERFACE]: {
        getParamsData: (projectId: string) => this.dpProjectExtendService.getTableAndColumnByProjectId(projectId),
        processData: (data: any) => data
      },
      [GenTypeMapEnum.PAGE]: {
        getParamsData: (projectId: string) => this.dpProjectExtendService.getMenu(projectId),
        processData: (data: any) => data.filter(item => item.type === 'page')
      },
      [GenTypeMapEnum.ROUTE]: {
        getParamsData: (projectId: string) => this.dpProjectExtendService.getMenu(projectId),
        processData: (data: any) => listToTree(data)
      },
      [GenTypeMapEnum.CONFIG]: {
        getParamsData: (projectId: string) => this.dpProjectExtendService.getEnvConfig(projectId),
        processData: (data: any) => data
      },
      [GenTypeMapEnum.EXTEND_SERVICE]: {
        getParamsData: () => Promise.resolve([]), // 暂未实现
        processData: (data: any) => data
      }
    };
  }
 /**
   * 测试模板运行函数
   * @param templateId 模板ID
   * @param menuId 菜单ID
   * @returns 模板运行结果
   */
 async testPageData(templateId: string, menuId: string): Promise<any> {
  const templateInfo = await this.dpTemplateService.findOne(templateId);
  const menuInfo = await this.dpMenuExtendService.findOne(menuId);
  const projectInfo = await this.dpProjectExtendService.getProjectInfo(menuInfo.bindProject);
  
  return this.dpTemplateExtendService.runFunc(templateInfo.templateCode, {
    PROJECT_INFO: projectInfo,
    PARAMS: menuInfo
  });
}
/**
   * 生成项目相关数据并输出
   * @param id 项目ID
   * @param type 生成类型
   * @param res 响应对象
   * @returns 输出结果
   */
async genProjectRelData(id: string, type: GenTypeMapEnum, res: Response): Promise<any> {
  const result = await this.getProjectRelData(id, type);
  return outputCode(res, result, type);
}

/**
   * 获取菜单相关数据
   * @param id 菜单ID
   * @returns 菜单相关数据
   */
async getMenuRelData(id: string): Promise<any> {
  if (!id) {
    return '菜单Id不存在';
  }
  
  const menu = await this.dpMenuExtendService.findOne(id);
  if (!menu || menu.type === 'module') {
    console.log('当前为模块');
    return [];
  }
  
  const projectInfo = await this.dpProjectExtendService.getProjectInfo(menu.bindProject);
  return this.commonService.getCode(projectInfo, [menu], GenTypeMapEnum.PAGE, GEN_TYPE_CONFIG[GenTypeMapEnum.PAGE].isSingle);
}

/**
 * 生成菜单相关数据并输出
 * @param id 菜单ID
 * @param res 响应对象
 * @returns 输出结果
 */
async genMenuRelData(id: string, res: Response): Promise<any> {
  const result = await this.getMenuRelData(id);
  // 使用新的formatByType函数，直接传入生成类型
  const formattedResult = formatByType(result, GenTypeMapEnum.PAGE);
  return outputCode(res, formattedResult, GenTypeMapEnum.PAGE);
}

  /**
   * 获取项目相关数据
   * @param id 项目ID
   * @param type 生成类型
   * @returns 项目相关数据
   */
  async getProjectRelData(id: string, type: GenTypeMapEnum): Promise<any> {
    const projectInfo = await this.dpProjectExtendService.getProjectInfo(id);
     // 使用适配器获取并处理数据
  const adapter = this.dataAdapters[type];
    if (!adapter) {
      console.log(`不支持的生成类型: ${type}`);
      return [];
    }
    
    let paramsData = await adapter.getParamsData(id);
    if (!paramsData) {
      console.log(`不存在paramsData----------${type}`);
      return [];
    }
    paramsData = adapter.processData(paramsData);
    const result = this.commonService.getCode(
      projectInfo, 
      paramsData, 
      type, 
      GEN_TYPE_CONFIG[type].isSingle
    );
    
    // 使用新的formatByType函数，直接传入生成类型
    return formatByType(result, type);
  }

  /**
   * 通过项目ID生成项目数据并输出
   * @param id 项目ID
   * @param res 响应对象
   * @returns 输出结果
   */
  async genProject(id: string, res: Response): Promise<any> {
    const projectData = await this.getProject(id);
    // TODO: 
    // - sql文件以及插入指定数据库
    // - zip解压到相对文件夹
    // - 解压前端目录
    // - 前端数据生成 =>拼接前端目录
    // - 解压后端目录
    // - 后端数据生成 =>拼接后端目录
    return outputCode(res, projectData.fe, 'project');
  }

  /**
   * 通过项目ID获取项目数据
   * @param id 项目ID
   * @returns 项目数据
   */
  async getProject(id: string): Promise<GenerationResult> {
    const genRequests = Object.values(GenTypeMapEnum).map(type => 
      this.getProjectRelData(id, type)
    );
    
    const results = await Promise.all(genRequests);
    
    // 按类型分组结果
    const feTypes = [
      GenTypeMapEnum.PAGE, 
      GenTypeMapEnum.ROUTE, 
      GenTypeMapEnum.CONFIG, 
      GenTypeMapEnum.BASE_SERVICE,
      GenTypeMapEnum.EXTEND_SERVICE
    ];
    
    const feResults = [];
    const beResults = [];
    
    Object.values(GenTypeMapEnum).forEach((type, index) => {
      if (feTypes.includes(type)) {
        feResults.push(...results[index]);
      } else {
        beResults.push(...results[index]);
      }
    });

    return {
      fe: feResults,
      be: beResults
    };
  }
}