import { Controller, Get, Post, Query, Redirect, Res } from '@nestjs/common';
import { DpGenService } from './dpGen.service';
import { ApiOperation, ApiQuery} from '@nestjs/swagger';
import { DpProjectExtendService } from '../dpProjectExtend/dpProjectExtend.service';
import { handleGit } from 'src/utils/autoDeploy';
import { handleCode } from 'src/utils/git';
import { GenFeEnum } from 'src/enums/genTypeMap.enum';
import { outputCode, uncompress } from 'src/utils/outputCode';
import path from 'path';
import * as os from 'os'
import { GenEnum } from 'src/enums/gen.enum';
@Controller('dpGen')
export class DpGenController {
  constructor(
    private readonly dpGenService: DpGenService,
    private readonly dpProjectExtendService: DpProjectExtendService,
  ) {}

  // 合成一个接口
  /**
   * 
   * @param type page | route | service | 
   * @param projectId  
   * @param gen 0 或者 1 默认为1 
   * @returns 
   */

  @Post('testPageFunc')
  @ApiOperation({ summary: '测试菜单函数' })
  getDpMenuExtend(@Query('templateId') templateId: string,@Query('menuId') menuId: string) {
    return this.dpGenService.testPageData(templateId,menuId);
  }

  @Post('getCode')
  @ApiOperation({ summary: '根据项目Id获取相关类型的代码' })
  @ApiQuery({
    name: 'type',
    enum: GenFeEnum,
    required: true,
  })
  @ApiQuery({
    name: 'isGen',
    enum: GenEnum,
    required: true,
    description:'是否生成代码 1生成 0不生成'
  })
  getCode(@Query('id') id: string,@Query('type') type: GenFeEnum,@Query('isGen') isGen :GenEnum=GenEnum.NO_GEN, @Res() res: Response) {
    return this.dpGenService.getProjectRelData1(id,type,isGen,res)
  }

  @Post('getCodeByMenuId')
  @ApiOperation({ summary: '根据菜单Id获取相关类型的代码' })
  @ApiQuery({
    name: 'type',
    enum: GenFeEnum,
    required: true,
  })
  @ApiQuery({
    name: 'isGen',
    enum: GenEnum,
    required: true,
    description:'是否生成代码 1生成 0不生成'
  })
  getCodeByMenuId(@Query('id') id: string,@Query('type') type: GenFeEnum,@Query('isGen') isGen :GenEnum=GenEnum.NO_GEN, @Res() res: Response) {
    return this.dpGenService.getProjectRelData1(id,type,isGen,res)
  }

  @Post('getFeService')
  @ApiOperation({ summary: '通过项目Id获取base_service',deprecated:true })
  getService(@Query('id') id: string) {
    return this.dpGenService.getProjectRelData(id,GenFeEnum.BASE_SERVICE)
  }

  @Post('genFeService')
  @ApiOperation({ summary: '通过项目Id生成base_service',deprecated:true })
  genService(@Query('id') id: string, @Res() res: Response) {
    return this.dpGenService.genProjectRelData(id,GenFeEnum.BASE_SERVICE,res)
  }

  @Post('getFeStore')
  @ApiOperation({ summary: '通过项目Id获取store',deprecated:true })
  getFeStore(@Query('id') id: string) {
    return this.dpGenService.getProjectRelData(id,GenFeEnum.STORE)
  }
  @Post('genFeStore')
  @ApiOperation({ summary: '通过项目Id生成store',deprecated:true })
  genFeStore(@Query('id') id: string, @Res() res: Response) {
    return this.dpGenService.genProjectRelData(id,GenFeEnum.STORE,res)
  }

  @Post('getFeConfig')
  @ApiOperation({ summary: '通过项目Id获取config',deprecated:true })
  getFeConfig(@Query('id') id: string) {
    return this.dpGenService.getProjectRelData(id,GenFeEnum.CONFIG)
  }
  @Post('genFeConfig')
  @ApiOperation({ summary: '通过项目Id生成config',deprecated:true })
  genFeConfig(@Query('id') id: string, @Res() res: Response) {
    return this.dpGenService.genProjectRelData(id,GenFeEnum.CONFIG,res)
  }

  @Post('getFeRoute')
  @ApiOperation({ summary: '通过项目Id获取route',deprecated:true })
  getRoute(@Query('id') id: string) {
    return this.dpGenService.getProjectRelData(id,GenFeEnum.ROUTE)
  }

  @Post('genFeRoute')
  @ApiOperation({ summary: '通过项目Id生成Route',deprecated:true })
  genFeRoute(@Query('id') id: string, @Res() res: Response) {
    return this.dpGenService.genProjectRelData(id,GenFeEnum.ROUTE,res)
  }

  @Post('getFePage')
  @ApiOperation({ summary: '通过项目Id获取page',deprecated:true })
  getPage(@Query('id') id: string) {
    return this.dpGenService.getProjectRelData(id,GenFeEnum.PAGE)
  }

  @Post('genFePage')
  @ApiOperation({ summary: '通过项目Id生成page',deprecated:true })
  genFePage(@Query('id') id: string, @Res() res: Response) {
    return this.dpGenService.genProjectRelData(id,GenFeEnum.PAGE,res)
  }

  @Post('getFePageByMenuId')
  @ApiOperation({ summary: '通过菜单Id获取page' })
  getPageByMenuId(@Query('menuId') menuId: string) {
    return this.dpGenService.getMenuRelData(menuId,GenFeEnum.PAGE)
  }

  @Post('genFePageByMenuId')
  @ApiOperation({ summary: '通过菜单Id生成page' })
  genPageByMenuId(@Query('menuId') menuId: string, @Res() res: Response) {
    return this.dpGenService.genMenuRelData(menuId,GenFeEnum.PAGE,res)
  }

  @Post('getFeRouteByMenuId')
  @ApiOperation({ summary: '通过菜单Id获取route' })
  getFeRouteByMenuId(@Query('menuId') menuId: string) {
    return this.dpGenService.getMenuRelData(menuId,GenFeEnum.ROUTE)
  }

  @Post('genFeRouteByMenuId')
  @ApiOperation({ summary: '通过菜单Id生成route' })
  genFeRouteByMenuId(@Query('menuId') menuId: string, @Res() res: Response) {
    return this.dpGenService.genMenuRelData(menuId,GenFeEnum.ROUTE,res)
  }

  @Post('getProject')
  @ApiOperation({ summary: '通过项目Id获取项目数据' })
  async getFeProject(@Query('id') id: string) {
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


  @Post('test')
  @ApiOperation({ summary: '页面生成工具' })
  async test(){
    return await this.dpGenService.test()
  }

}
