import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DpTemplateService } from 'src/modules/base/dpTemplate';
import { buildTemplateTree } from './utils/buildTemplateTree';
import { VMRunner } from './utils/VMRunner';

@Injectable()
export class DpTemplateExtendService {
  constructor(private readonly dpTemplateService: DpTemplateService) {}
  async getTemplateTree() {
    const templateList = await this.dpTemplateService.findAll();
    return buildTemplateTree(templateList);
  }

  runFunc(templateCode, context) {
    const result = VMRunner.getInstance().run(templateCode, context);
    return result;
  }
}
