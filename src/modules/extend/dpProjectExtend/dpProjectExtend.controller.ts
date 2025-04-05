import { Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { DpProjectExtendService } from './dpProjectExtend.service';
import { ApiOperation } from '@nestjs/swagger';

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

  @Post('/getProject')
  @ApiOperation({ summary: '返回数据以及数据详情' })
  async getProject() {
    return this.dpProjectExtendService.getProject()
  }

  @Post('/getProjectInfo')
  @ApiOperation({ summary: '返回数据以及数据详情' })
  async getProjectInfo(@Query('id') id: string) {
    return this.dpProjectExtendService.getProjectInfo(id)
  }

  @Post('/deleteProjectById')
  @ApiOperation({ summary: '删除项目' })
  async deleteProject(@Query('id') id: string,@Req() req: Request) {
    return this.dpProjectExtendService.deleteProjectById(id,req)
  }

  @Post('/deleteMenuByProjectId')
  @ApiOperation({ summary: '根据项目id删除菜单' })
  async deleteMenuByProjectId(@Query('id') id: string,@Req() req: Request) {
    return this.dpProjectExtendService.deleteMenuByProjectId(id,req)
  }
}
 