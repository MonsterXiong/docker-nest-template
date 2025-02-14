import { Controller, Get, Post, Query } from '@nestjs/common';
import { DpProjectExtendService } from './dpProjectExtend.service';
import { ApiOperation } from '@nestjs/swagger';
import { handleGit } from 'src/utils/autoDeploy';
import { handleCode } from 'src/utils/git';

@Controller('dpProjectExtend')
export class DpProjectExtendController {
  constructor(
    private readonly dpProjectExtendService: DpProjectExtendService,
  ) {}

  @Post('/db/tables')
  @ApiOperation({ summary: '根据项目id获取数据库表信息' })
  async testDbByProjectId(@Query('id') id: string) {
    return this.dpProjectExtendService.getTableByProjectId(id)
  }

  @Post('/db/tablesAndColumns')
  @ApiOperation({ summary: '根据项目id获取数据库表及字段信息' })
  async getTableAndColumnByProjectId(@Query('id') id: string) {
    return this.dpProjectExtendService.getTableAndColumnByProjectId(id)
  }

  @Get()
  @ApiOperation({ summary: '测试' })
  async getAuto(@Query('id') id: string) {
    const projectInfo = await this.dpProjectExtendService.getProjectInfo(id)
    const gitUrl = await handleGit(projectInfo);
    await handleCode(gitUrl)
    // 处理jenkins
    return 'ok'
  }
}
