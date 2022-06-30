import { Controller, Post, Query, Req } from '@nestjs/common';
import { DpTemplateExtendService } from './dpTemplateExtend.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('dp-template-extend')
export class DpTemplateExtendController {
  constructor(private readonly dpTemplateExtendService: DpTemplateExtendService) {}


  @Post('copyTemplate')
  @ApiOperation({ summary: '通过模板Id复制到目标id下' })
  copyTemplate(@Query('templateId') templateId: string,@Query('targetId') targetId: string,@Req() req: Request) {
    return this.dpTemplateExtendService.copyTemplate(templateId,targetId,req)
  }
}
