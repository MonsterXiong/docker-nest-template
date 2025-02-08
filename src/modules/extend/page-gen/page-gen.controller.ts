import { DpTemplateService } from 'src/modules/base/dpTemplate/dpTemplate.service';
import { Controller, Post, Query } from '@nestjs/common';
import { PageGenService } from './page-gen.service';
import { DpProjectExtendService } from '../dpProjectExtend/dpProjectExtend.service';
import { ApiOperation } from '@nestjs/swagger';
import { genPageCode } from './utils';

@Controller('page-gen')
export class PageGenController {
  constructor(
    private readonly pageGenService: PageGenService,
    private readonly dpTemplateService: DpTemplateService,
    private readonly dpProjectExtendService: DpProjectExtendService,
  ) {}

  @Post()
  @ApiOperation({ summary: '获取项目信息' })
  async findAll(@Query('id') id: string) {
    // 根据项目id获取项目数据
    const [projectInfo, templateList, menuList] = await Promise.all([
      this.dpProjectExtendService.getProjectInfo(id),
      this.dpTemplateService.findAll(),
      this.dpProjectExtendService.getMenu(id),
    ]);
    const result = genPageCode(projectInfo, templateList, menuList);
    return result;
  }
}
