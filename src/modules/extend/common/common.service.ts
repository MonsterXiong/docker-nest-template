import { Injectable, OnModuleInit } from '@nestjs/common';
import * as ejs from 'ejs';
import {
  getGroupList,
  getInterfaceBatch,
  getServiceBatch,
} from './utils/getSwaggerService';
import { DpTemplateExtendService } from '../dpTemplateExtend/dpTemplateExtend.service';
import { GenTypeMapEnum } from 'src/enums/genTypeMap.enum';
import { DpProjectExtendService } from '../dpProjectExtend/dpProjectExtend.service';
@Injectable()
export class CommonService implements OnModuleInit {
  private TemplateTree;
  constructor(
    private readonly dpTemplateExtendService: DpTemplateExtendService,
    private readonly dpProjectExtendService: DpProjectExtendService,
  ) {}
  async onModuleInit() {
    this.TemplateTree = await this.dpTemplateExtendService.getTemplateTree();
  }


  getTemplate(type){
    return this.TemplateTree.find((item) => item.code === type);
  }


  _genCode(type, context) {
    // todo:优化 可删除
    this.onModuleInit();

    const template = this.getTemplate(type);
    const templateData = this.dpTemplateExtendService.runFunc(template.templateCode,context);
    
    return template.children.reduce((pre, templateItem) => {
      if (templateItem.templateCode) {
        pre.push({
          code: ejs.render(templateItem.templateCode, templateData),
          filePath: templateItem.filePath,
          fileExt: templateItem.templateExt,
        });
      }
      return pre;
    }, []);
  }

  getCode(projectInfo, list, type, isSingle = false) {
    if (isSingle) {
      return this._genCode(type, {
        PROJECT_INFO: projectInfo,
        PARAMS: list,
      });
    }
    return list.map((item) => {
      let codeType = type;
      if (type == GenTypeMapEnum.PAGE) {
        const configParam = JSON.parse(item.menuDetail.configParam);
        codeType = configParam.code;
      }
      return {
        ...item,
        children: this._genCode(codeType, {
          PROJECT_INFO: projectInfo,
          PARAMS: item,
        }),
      };
    });
  }

  async getSwaggerService() {
    const params = {
      baseUrl: 'http://192.168.2.231:8062',
      account: 'admin',
      password: '123456',
    };
    const groupList = await getGroupList(params);
    let serviceList = await getServiceBatch(params.baseUrl, groupList);
    return serviceList;
  }
}
