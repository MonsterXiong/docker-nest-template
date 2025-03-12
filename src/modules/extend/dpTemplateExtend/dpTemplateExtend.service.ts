import {  Injectable } from '@nestjs/common';
import { DpTemplateService } from 'src/modules/base/dpTemplate';
import { buildTemplateTree, handleProceeQuote } from './utils/buildTemplateTree';
import { VMRunner } from './utils/VMRunner';
import { findTreeByArr, refreshFlatIds } from 'src/utils/findTreeByArr';
import { listToPathMap } from './utils/listToPathMap';
@Injectable()
export class DpTemplateExtendService {
  constructor(private readonly dpTemplateService: DpTemplateService) {}
  async getTemplateTree() {
    const templateList = await this.dpTemplateService.findAll();
    const templateModuleTree = buildTemplateTree(templateList)
    return handleProceeQuote(templateModuleTree);
  }

  async getTemplateMap() {
    const templateList = await this.dpTemplateService.findAll();
    const list = templateList.filter(item => item.templateType !== 'category')
    return listToPathMap(list)
  }

  async copyTemplate(templateId,targetId,req){
    const templateList = await this.dpTemplateService.findAll();
    const filterList = findTreeByArr(templateList,templateId)
    const list = refreshFlatIds(filterList,templateId,targetId)
    await this.dpTemplateService.insertBatch(list,req)
    return list
  }

  runFunc(templateCode, context,options={}) {
    const result = VMRunner.getInstance(options).run(templateCode, context);
    return result;
  }
}
