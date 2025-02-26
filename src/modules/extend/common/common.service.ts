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
import { DpTemplatePromptService } from 'src/modules/base/dpTemplatePrompt';
import { formatObject } from './utils/formatObject'
import QueryConditionBuilder from 'src/utils/queryCondition';
@Injectable()
export class CommonService implements OnModuleInit {
  private TEMPLATE_TREE;
  private TEMPLATE_PROMPT;
  constructor(
    private readonly dpTemplateExtendService: DpTemplateExtendService,
    private readonly dpProjectExtendService: DpProjectExtendService,
    private readonly dpTemplatePromptService: DpTemplatePromptService,
  ) {}
  async onModuleInit() {
    this.TEMPLATE_TREE = await this.dpTemplateExtendService.getTemplateTree();
    this.TEMPLATE_PROMPT = await this._getTemplatePrompList()
  }

  async _getTemplatePrompList(){
    const queryCondition = QueryConditionBuilder.getInstanceNoPage()
    queryCondition.buildEqualQuery('type','Template')
    const { data } =  await this.dpTemplatePromptService.queryList(queryCondition)
    return data
  }
  getTemplate(type){
    return this.TEMPLATE_TREE.find((item) => item.code === type);
  }

  _genTemplateFunc(){
    const returnStr = `\r\nreturn { ${this.TEMPLATE_PROMPT.map(item=>item.code).join(',')}}`
    const funcStr = this.TEMPLATE_PROMPT.map(item=>item.value+'\n').join('')+returnStr
    const templateFunc = this.dpTemplateExtendService.runFunc(funcStr,{});
    console.log(templateFunc);
    return templateFunc
  }

  _genCode(type, context) {
    // todo:优化 可删除
    this.onModuleInit();

    const template = this.getTemplate(type);
    const templateData = this.dpTemplateExtendService.runFunc(template.templateCode,context);
    const templateFunc = this._genTemplateFunc()
    
    return template.children.reduce((pre, templateItem) => {
      if (templateItem.templateCode) {
        pre.push({
          code: ejs.render(templateItem.templateCode, {...templateData,TEMPLATE_UTILS:{...templateFunc,formatObject}}),
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
