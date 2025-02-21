import * as changeCase from 'change-case'
import path from 'path';
import { Injectable } from '@nestjs/common';
import { DpProjectService } from 'src/modules/base/dpProject/dpProject.service';
import { DpProjectInfoService } from 'src/modules/base/dpProjectInfo';
import { DpEnvConfigService } from 'src/modules/base/dpEnvConfig';
import { DpMenuExtendService } from 'src/modules/extend/dpMenuExtend/dpMenuExtend.service';
import { DbService } from '../db';
import { CommonService } from 'src/modules/extend/common/common.service';
import { GenTypeMapEnum, TYPE_MAP_SINGLE } from 'src/enums/genTypeMap.enum';
import { DpProjectExtendService } from '../dpProjectExtend/dpProjectExtend.service';
import { DpTemplateService } from 'src/modules/base/dpTemplate';
import { DpTemplateExtendService } from '../dpTemplateExtend/dpTemplateExtend.service';
import { outputCode } from 'src/utils/outputCode';

@Injectable()
export class DpGenService {
    constructor(
        private readonly dpProjectService: DpProjectService,
        private readonly dpProjectInfoService: DpProjectInfoService,
        private readonly dpMenuExtendService: DpMenuExtendService,
        private readonly dbService: DbService,
        private readonly dpEnvConfigService: DpEnvConfigService,
        private readonly commonService: CommonService,
        private readonly dpProjectExtendService: DpProjectExtendService,
        private readonly dpTemplateService: DpTemplateService,
        private readonly dpTemplateExtendService: DpTemplateExtendService
    
      ) { }

      async testFunc(){

      }

      async getMenuFunc(templateId,menuId){ 
        const templateInfo = await this.dpTemplateService.findOne(templateId)
        const menuInfo = await this.dpMenuExtendService.findOne(menuId)
        const PROJECT_INFO = await this.dpProjectExtendService.getProjectInfo(menuInfo.bindProject)
        const result = this.dpTemplateExtendService.runFunc(templateInfo.templateCode,{
            PROJECT_INFO,
            PARAMS:menuInfo
        })
        return result
    }
      async testPageData(templateId,menuId){
          return await this.getMenuFunc(templateId,menuId)
        // return await this.getMenuFunc(templateId,menuId)
      }
    // //   前端
    //   async genPage(projectInfo,menu){
    //     const pageData = this.commonService.getCode(projectInfo, menu, GenTypeMapEnum.PAGE,TYPE_MAP_SINGLE.PAGE)
    //     const page = format(pageData,TYPE_MAP_SINGLE.PAGE)
    //   }
    //   async genPageList(){}
    //   async genRoute(){}
    //   async genRouteList(){}
    //   async genEnvConfig(){}
    //   async genEnvConfigList(){}
    //   async genBaseService(){}
    //   async genBaseServiceList(){}
    //   async genExtendService(){}
    //   async genExtendServiceList(){}

    // //   后端
    //   async genInterface(){}
    //   async genModule(){}

      // 通过项目id获取前端service的数据
  async getServiceByProjectId(id){
    const projectInfo =  await  this.dpProjectExtendService.getProjectInfo(id)
    const serviceData = await this.getServiceByProjectInfo(projectInfo)
    return serviceData
   }
   // 通过项目id获取前端page的数据
   async getPageByProjectId(id){
    const projectInfo =  await  this.dpProjectExtendService.getProjectInfo(id)
    const serviceData = await this.getPageByProjectInfo(projectInfo)
    return serviceData
   }
 
     // 通过项目信息获取前端page的数据
     async getPageByProjectInfo(projectInfo){
       const menuList = await this.dpProjectExtendService.getMenu(projectInfo.id)
       const pageData = this.commonService.getCode(projectInfo, menuList, GenTypeMapEnum.PAGE,TYPE_MAP_SINGLE.PAGE)
       const page = format(pageData,TYPE_MAP_SINGLE.PAGE)
       return page
     }
   
 
   // 通过项目id生成前端service的数据
   async genService(id,res){
     const serviceData = await this.getServiceByProjectId(id)
     return outputCode(res,serviceData,'service')
   }
 
     // 通过项目id生成前端service的数据
     async genPage(id,res){
       const pageData = await this.getPageByProjectId(id)
       return outputCode(res,pageData,'page')
     }
 
   // 通过项目信息获取前端service的数据
   async getServiceByProjectInfo(projectInfo){
     const dbList = await this.dpProjectExtendService.getTableAndColumnByProjectId(projectInfo.id)
     const serviceData = this.commonService.getCode(projectInfo, dbList, GenTypeMapEnum.BASE_SERVICE,TYPE_MAP_SINGLE.BASE_SERVICE)
     const serviceList = format(serviceData,TYPE_MAP_SINGLE.BASE_SERVICE, 'tableName')
     return serviceList
   }


   async genProject(id) {
    const [projectInfo, envConfigList, menuList, dbList] = await Promise.all([
      // 获取项目信息
      this.dpProjectExtendService.getProjectInfo(id),
      // 获取项目配置信息
      this.dpProjectExtendService.getEnvConfig(id),
      // 获取菜单信息以及菜单详情信息
      this.dpProjectExtendService.getMenu(id),
      // 获取数据库信息
      this.dpProjectExtendService.getTableAndColumnByProjectId(id)
    ])
    // 生成前端
    const pageData = this.commonService.getCode(projectInfo, menuList, GenTypeMapEnum.PAGE,TYPE_MAP_SINGLE.PAGE)
    
    // // todo:生成完页面需要生成路由数据=>还需要完善
    // const routeData = this.commonService.getCode(projectInfo, listToTree(menuList), GenTypeMapEnum.ROUTE,TYPE_MAP_SINGLE.ROUTE)

    // // 生成env数据 todo:config数据=>还需要完善
    // const envConfigData = this.commonService.getCode(projectInfo, envConfigList, GenTypeMapEnum.CONFIG,TYPE_MAP_SINGLE.CONFIG)
    // 生成基础接口
    // const serviceData = this.commonService.getCode(projectInfo, dbList, GenTypeMapEnum.BASE_SERVICE,TYPE_MAP_SINGLE.BASE_SERVICE)
    // 生成扩展接口
    // const extendServiceList = await this.commonService.getSwaggerService()
    // const extendServiceData = this.commonService.getCode(projectInfo, extendServiceList, GenTypeMapEnum.EXTEND_SERVICE,TYPE_MAP_SINGLE.EXTEND_SERVICE)
    // 生成后端接口
    // const interfaceData = this.commonService.getCode(projectInfo, dbList, GenTypeMapEnum.INTERFACE,TYPE_MAP_SINGLE.INTERFACE)
    // const moduleData = this.commonService.getCode(projectInfo, dbList, GenTypeMapEnum.MODULE,TYPE_MAP_SINGLE.MODULE)

    // todo:生成枚举
    const page = format(pageData,TYPE_MAP_SINGLE.PAGE)
    // const db = format(interfaceData,TYPE_MAP_SINGLE.INTERFACE, 'tableName')
    // const moduleEntry = format(moduleData,TYPE_MAP_SINGLE.MODULE, '')
    // const route = format(routeData,TYPE_MAP_SINGLE.ROUTE)
    // const envConfig = format(envConfigData,TYPE_MAP_SINGLE.CONFIG, '')
    // const service = format(serviceData,TYPE_MAP_SINGLE.BASE_SERVICE, 'tableName')
    // const extendService = format(extendServiceData,TYPE_MAP_SINGLE.EXTEND_SERVICE, 'serviceName')
    // 需要清洗路径和数据
    return {
      // extendService
      pageData: page,
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
  
