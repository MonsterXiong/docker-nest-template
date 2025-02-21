import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { DpGenService } from './dpGen.service';
import { ApiOperation } from '@nestjs/swagger';
import { DpProjectExtendService } from '../dpProjectExtend/dpProjectExtend.service';
import { handleGit } from 'src/utils/autoDeploy';
import { handleCode } from 'src/utils/git';

@Controller('dpGen')
export class DpGenController {
  constructor(
    private readonly dpGenService: DpGenService,
    private readonly dpProjectExtendService: DpProjectExtendService,
  ) {}

  @Post('testPageFunc')
  @ApiOperation({ summary: '测试菜单函数' })
  getDpMenuExtend(@Query('templateId') templateId: string,@Query('menuId') menuId: string) {
    return this.dpGenService.testPageData(templateId,menuId);
  }

  @Post('genService')
  @ApiOperation({ summary: '通过项目Id生成service' })
  genService(@Query('id') id: string, @Res() res: Response) {
    return this.dpGenService.genService(id,res)
  }

  @Post('getService')
  @ApiOperation({ summary: '通过项目Id获取service' })
  getService(@Query('id') id: string) {
    return this.dpGenService.getServiceByProjectId(id)
  }


  @Post('genPage')
  @ApiOperation({ summary: '通过项目Id生成Page' })
  genPage(@Query('id') id: string, @Res() res: Response) {
    return this.dpGenService.genPage(id,res)
  }

  @Post('genProject')
  @ApiOperation({ summary: '测试' })
  async genProject(@Query('id') id: string) {
    const result = await this.dpGenService.genProject(id)
    return result || 'ok'
  }

  @Get()
  @ApiOperation({ summary: '生成项目流程-未完成' })
  async getAuto(@Query('id') id: string) {
    const projectInfo = await this.dpProjectExtendService.getProjectInfo(id)
    const gitUrl = await handleGit(projectInfo);
    await handleCode(gitUrl)
    // 处理jenkins
    return 'ok'
  }
}
