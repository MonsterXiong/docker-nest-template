import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { DpGenService } from './dpGen.service';
import { ApiOperation } from '@nestjs/swagger';
import { DpProjectExtendService } from '../dpProjectExtend/dpProjectExtend.service';
import { handleGit } from 'src/utils/autoDeploy';
import { handleCode } from 'src/utils/git';
import { GenTypeMapEnum } from 'src/enums/genTypeMap.enum';

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

  @Post('genFeService')
  @ApiOperation({ summary: '通过项目Id生成service' })
  genService(@Query('id') id: string, @Res() res: Response) {
    return this.dpGenService.genProjectRelData(id,GenTypeMapEnum.BASE_SERVICE,res)
  }

  @Post('genFePage')
  @ApiOperation({ summary: '通过项目Id生成Page' })
  genPage(@Query('id') id: string, @Res() res: Response) {
    return this.dpGenService.genProjectRelData(id,GenTypeMapEnum.PAGE,res)
  }

  @Post('genFeRoute')
  @ApiOperation({ summary: '通过项目Id生成Route' })
  genRoute(@Query('id') id: string, @Res() res: Response) {
    return this.dpGenService.genProjectRelData(id,GenTypeMapEnum.ROUTE,res)
  }

  @Post('getFeService')
  @ApiOperation({ summary: '通过项目Id获取base_service' })
  getService(@Query('id') id: string) {
    return this.dpGenService.getProjectRelData(id,GenTypeMapEnum.BASE_SERVICE)
  }

  @Post('getFeRoute')
  @ApiOperation({ summary: '通过项目Id获取route' })
  getRoute(@Query('id') id: string) {
    return this.dpGenService.getProjectRelData(id,GenTypeMapEnum.ROUTE)
  }

  @Post('getFePage')
  @ApiOperation({ summary: '通过项目Id获取page' })
  getPage(@Query('id') id: string) {
    return this.dpGenService.getProjectRelData(id,GenTypeMapEnum.PAGE)
  }

  @Post('getProject')
  @ApiOperation({ summary: '通过项目Id获取项目数据' })
  async getProject(@Query('id') id: string) {
    return await this.dpGenService.getProject(id)
  }

  @Post('genProject')
  @ApiOperation({ summary: '通过项目Id生成项目' })
  genProject(@Query('id') id: string, @Res() res: Response) {
    return this.dpGenService.genProject(id,res)
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
