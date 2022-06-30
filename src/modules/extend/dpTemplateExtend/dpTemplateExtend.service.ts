import {  Injectable } from '@nestjs/common';
import { DpTemplateService } from 'src/modules/base/dpTemplate';
import { buildTemplateTree } from './utils/buildTemplateTree';
import { VMRunner } from './utils/VMRunner';
import { findTreeByArr, refreshFlatIds } from 'src/utils/findTreeByArr';
@Injectable()
export class DpTemplateExtendService {
  constructor(private readonly dpTemplateService: DpTemplateService) {}
  async getTemplateTree() {
    const templateList = await this.dpTemplateService.findAll();
    return buildTemplateTree(templateList);
  }

  async copyTemplate(templateId,targetId,req){
    const templateList = await this.dpTemplateService.findAll();
    const filterList = findTreeByArr(templateList,templateId)
    const list = refreshFlatIds(filterList,templateId,targetId)
    await this.dpTemplateService.insertBatch(list,req)
    return list
  }

  runFunc(templateCode, context) {
    const result = VMRunner.getInstance().run(templateCode, context);
    return result;
  }
}
