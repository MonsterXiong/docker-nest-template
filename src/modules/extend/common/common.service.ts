import { Injectable, OnModuleInit } from '@nestjs/common';
import { DpTemplateService } from 'src/modules/base/dpTemplate/dpTemplate.service';
import { buildTemplateTree } from './utils/buildTemplateTree';
import { VMRunner } from './utils/VMRunner';
import * as ejs from 'ejs';

@Injectable()
export class CommonService implements OnModuleInit {
  private TemplateTree;
  constructor(
    private readonly dpTemplateService: DpTemplateService,
  ) { }
  async onModuleInit() {
    this.TemplateTree = await this._getTemplateList()
  }

  async _getTemplateList() {
    const templateList = await this.dpTemplateService.findAll()
    return buildTemplateTree(templateList)
  }

  _genCode(type, context) {
    // todo:优化 可删除
    this.onModuleInit()

    const template = this.TemplateTree.find(item => item.code === type)
    const templateData = VMRunner.getInstance().run(template.templateCode, context)
    return template.children.map((templateItem) => {
      if (templateItem.templateCode) {
        return {
          code: ejs.render(templateItem.templateCode, templateData),
          filePath: templateItem.filePath,
          fileExt:templateItem.templateExt
        }
      }
    });
  }

  getCode(projectInfo, list, type,isSingle =false) {
    if(isSingle){
      return this._genCode(type, {
        PROJECT_INFO:projectInfo,
        PARAMS:list
      })
    }
    return list.map(item => {
      let codeType = type
      if (type == 'page') {
        const configParam = JSON.parse(item.menuDetail.configParam);
        codeType = configParam.code
      }
      return {
        ...item,
        children: this._genCode(codeType, {
          PROJECT_INFO:projectInfo,
          PARAMS: item,
        }),
      }
    })
  }

}
