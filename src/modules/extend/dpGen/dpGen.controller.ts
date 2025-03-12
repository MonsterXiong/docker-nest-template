import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { DpGenService } from './dpGen.service';
import { ApiOperation } from '@nestjs/swagger';
import { DpProjectExtendService } from '../dpProjectExtend/dpProjectExtend.service';
import { handleGit } from 'src/utils/autoDeploy';
import { handleCode } from 'src/utils/git';
import { GenTypeMapEnum } from 'src/enums/genTypeMap.enum';
import { outputCode, uncompress } from 'src/utils/outputCode';
import path from 'path';
import * as os from 'os'
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
  @ApiOperation({ summary: '通过项目Id生成base_service' })
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

  @Post('getFePageByMenuId')
  @ApiOperation({ summary: '通过菜单Id获取page' })
  getPageByMenuId(@Query('menuId') menuId: string) {
    return this.dpGenService.getMenuRelData(menuId,GenTypeMapEnum.PAGE)
  }

  @Post('genFePageByMenuId')
  @ApiOperation({ summary: '通过菜单Id生成page' })
  genPageByMenuId(@Query('menuId') menuId: string, @Res() res: Response) {
    return this.dpGenService.genMenuRelData(menuId,GenTypeMapEnum.PAGE,res)
  }

  @Post('getFeRouteByMenuId')
  @ApiOperation({ summary: '通过菜单Id获取route' })
  getFeRouteByMenuId(@Query('menuId') menuId: string) {
    return this.dpGenService.getMenuRelData(menuId,GenTypeMapEnum.ROUTE)
  }

  @Post('genFeRouteByMenuId')
  @ApiOperation({ summary: '通过菜单Id生成route' })
  genFeRouteByMenuId(@Query('menuId') menuId: string, @Res() res: Response) {
    return this.dpGenService.genMenuRelData(menuId,GenTypeMapEnum.ROUTE,res)
  }

  @Post('getProject')
  @ApiOperation({ summary: '通过项目Id获取项目数据' })
  async getProject(@Query('id') id: string) {
    return await this.dpGenService.getFeProject(id)
  }

  @Post('genProject')
  @ApiOperation({ summary: '通过项目Id生成项目' })
  async genProject(@Query('id') id: string, @Res() res: Response) {
    const projectData = await this.dpGenService.genFeProject(id)


    const projectPath = path.join(os.homedir(),'.monster_dp/temp')
    
    await uncompress('public/framework.fe.zip', projectPath)
    // 解压到当前目录

    return outputCode(res, projectData.fe, 'project',projectPath);
  }

  @Get()
  @ApiOperation({ summary: '生成项目流程-未启动' })
  async getAuto(@Query('id') id: string) {
    const projectInfo = await this.dpProjectExtendService.getProjectInfo(id)
    const gitUrl = await handleGit(projectInfo);
    await handleCode(gitUrl)
    // 处理jenkins

    // 整个流程确定

    // 第一步：建项目-建Git-建JENKINS-建打包脚本-建首页导航

    // 第二步：后端

    // 第三步：前端

    // 第四步：打包更新到Git并出发Jenkins以及生成打包压缩包

    // 注：每一步都可拆分、单独调用

    // 其它：
    // A、按照项目处理：测试脚本生成
    // B、数据迁移服务
    // C、尽量都传入到线上服务
    // 开始处理扩展接口问题 =>如果生成扩展接口 对接页面上的扩展按钮
    return 'ok'
  }

  @Post('handleGit')
  @ApiOperation({ summary: '通过项目Id操作Git' })
  async handleGit1(@Query('id') id: string){
    return await this.dpGenService.handlePrepare(id,'git')
  }

  @Post('handleJenkins')
  @ApiOperation({ summary: '通过项目Id操作Jenkins' })
  async handleJenkins(@Query('id') id: string){
    return await this.dpGenService.handlePrepare(id,'jenkins')
  }

  @Post('handleBuildScript')
  @ApiOperation({ summary: '通过项目Id操作打包脚本' })
  async handleBuildScript(@Query('id') id: string){
    return await this.dpGenService.handlePrepare(id,'buildScript')
  }

  @Post('handleHomeNav')
  @ApiOperation({ summary: '通过项目Id操作首页导航' })
  async handleHomeNav(@Query('id') id: string){
    return await this.dpGenService.handlePrepare(id,'homeNav')
  }

}
