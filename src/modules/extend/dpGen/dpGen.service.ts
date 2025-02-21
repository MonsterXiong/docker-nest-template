import { Injectable } from '@nestjs/common';
import { DpEnvConfigService } from 'src/modules/base/dpEnvConfig';
import { DpMenuExtendService } from 'src/modules/extend/dpMenuExtend/dpMenuExtend.service';
import { DbService } from '../db';
import { CommonService } from 'src/modules/extend/common/common.service';
import { GenTypeMapEnum, TYPE_MAP_CODE, TYPE_MAP_SINGLE } from 'src/enums/genTypeMap.enum';
import { DpProjectExtendService } from '../dpProjectExtend/dpProjectExtend.service';
import { DpTemplateService } from 'src/modules/base/dpTemplate';
import { DpTemplateExtendService } from '../dpTemplateExtend/dpTemplateExtend.service';
import { outputCode } from 'src/utils/outputCode';
import { listToTree } from 'src/utils/treeTool';
import { format } from './dbGen.utils';

@Injectable()
export class DpGenService {
  constructor(
    private readonly dpMenuExtendService: DpMenuExtendService,
    private readonly commonService: CommonService,
    private readonly dpProjectExtendService: DpProjectExtendService,
    private readonly dpTemplateService: DpTemplateService,
    private readonly dpTemplateExtendService: DpTemplateExtendService

  ) { }

  // 测试菜单页面的运行函数
  async testPageData(templateId, menuId) {
    const templateInfo = await this.dpTemplateService.findOne(templateId)
    const menuInfo = await this.dpMenuExtendService.findOne(menuId)
    const PROJECT_INFO = await this.dpProjectExtendService.getProjectInfo(menuInfo.bindProject)
    const result = this.dpTemplateExtendService.runFunc(templateInfo.templateCode, {
      PROJECT_INFO,
      PARAMS: menuInfo
    })
    return result
  }
  async genProjectRelData(id, type, res) {
    const result = await this.getProjectRelData(id, type)
    return outputCode(res, result, type)
  }

  async getProjectRelData(id, type){
    const projectInfo = await this.dpProjectExtendService.getProjectInfo(id)
    const IS_SINGLE = TYPE_MAP_SINGLE[type]
    const TRANS_CODE = TYPE_MAP_CODE[type]
    let paramsData = null
    if ([GenTypeMapEnum.MODULE,GenTypeMapEnum.BASE_SERVICE, GenTypeMapEnum.INTERFACE].includes(type)) {
      paramsData = await this.dpProjectExtendService.getTableAndColumnByProjectId(id)
    } else if ([GenTypeMapEnum.PAGE,GenTypeMapEnum.ROUTE].includes(type)) {
      paramsData = await this.dpProjectExtendService.getMenu(id)
    }else if (type === GenTypeMapEnum.CONFIG) {
      paramsData = await this.dpProjectExtendService.getEnvConfig(id)
    }else if(type === GenTypeMapEnum.EXTEND_SERVICE){
      // paramsData = await this.commonService.getSwaggerService()
    }
    if (type === GenTypeMapEnum.ROUTE) {
      paramsData = listToTree(paramsData)
    }
    if(!paramsData){
      console.log(`不存在paramsData----------${type}`)
      return []
    }
    const result = this.commonService.getCode(projectInfo, paramsData, type, IS_SINGLE)
    return format(result, IS_SINGLE, TRANS_CODE)
  }
  // 通过项目id生成项目数据
  async genProject(id, res) {
    const projectData = await this.getProject(id)
    // sql文件 以及插入指定数据库
    // zip解压到相对文件夹
    // 解压前端目录
    // 前端数据生成 =>拼接前端目录
    // 解压后端目录
    // 后端数据生成 =>拼接后端目录
    return outputCode(res, projectData.fe, 'project')
  }
  // 通过项目id获取项目数据
  async getProject(id) {
    const genRequest = []
    for (const key in GenTypeMapEnum) {
      genRequest.push(this.getProjectRelData(id, GenTypeMapEnum[key]))
    }
    const [pageList, routeList, envConfigList, serviceList,extendServiceList,interfaceList,moduleList] = await Promise.all(genRequest)

    // 生成env数据 todo:config数据=>还需要完善
    // todo:生成枚举
    return {
      fe: [
        ...pageList,
        ...routeList,
        ...envConfigList,
        ...serviceList,
        ...extendServiceList
      ],
      be: [
        ...interfaceList,
        ...moduleList
      ]
    }

  }
}
