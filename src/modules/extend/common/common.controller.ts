import { Controller, Post, Query } from '@nestjs/common';
import { CommonService } from './common.service';
import { ApiOperation } from '@nestjs/swagger';
import { BootstrapService } from '../bootstrap/bootstrap.service';

@Controller('common')
export class CommonController {
  constructor(
    private readonly commonService: CommonService,
    private readonly bootstrapService: BootstrapService) {
  }

  @Post('translator')
  @ApiOperation({ summary: '根据name进行翻译' })
  async translator(@Query('name') name: string) {
    return this.bootstrapService.translator(name)
  }
}
