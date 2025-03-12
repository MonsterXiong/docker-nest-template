import { Body, Controller, Post, Query, Req, Res } from '@nestjs/common';
import { DpMetaDatabaseExtendService } from './dpMetaDatabaseExtend.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('dpMetaDatabaseExtend')
export class DpMetaDatabaseExtendController {
  constructor(private readonly dpMetaDatabaseExtendService: DpMetaDatabaseExtendService) {}


  @Post('/getMetaDatabase')
  @ApiOperation({ summary: '所有的数据体系及其详情' })
  async getMetaDatabase() {
    return this.dpMetaDatabaseExtendService.getMetaDatabase()
  }

  @Post('/getMetaDatabaseById')
  @ApiOperation({ summary: '返回指定数据体系及其详情' })
  async getProjectInfo(@Query('id') id: string) {
    return this.dpMetaDatabaseExtendService.getMetaDatabaseById(id)
  }

  @Post('/copyMetaDatabase')
  @ApiOperation({ summary: '引用数据体系' })
  async copyMetaDatabase(@Query('source') source: string,@Query('target') target: string,@Req() req: Request) {
    return this.dpMetaDatabaseExtendService.copyMetaDatabase(source,target,req)
  }
  
  @Post('/copyEntity')
  @ApiOperation({ summary: '引用元对象' })
  async copyEntity(@Body() entityIds: string[],@Query('databaseId') databaseId: string,@Req() req: Request) {
    return this.dpMetaDatabaseExtendService.copyEntity(entityIds,databaseId,req)
  }

  @Post('genSql')
  @ApiOperation({ summary: '生成sql' })
  async genSql(@Query('id') id: string, @Res() res: Response){
    return await this.dpMetaDatabaseExtendService.genSql(id,res)
  }

  @Post('getSql')
  @ApiOperation({ summary: '获取sql' })
  async getSql(@Query('id') id: string){
    return await this.dpMetaDatabaseExtendService.getSql(id)
  }

  @Post('getTableSql')
  @ApiOperation({ summary: '获取表sql' })
  async getTableSql(@Query('entityId') entityId: string){
    return await this.dpMetaDatabaseExtendService.getTableSql(entityId)
  }

  @Post('genTableSql')
  @ApiOperation({ summary: '生成表sql' })
  async genTableSql(@Query('entityId') id: string, @Res() res: Response){
    return await this.dpMetaDatabaseExtendService.genTableSql(id,res)
  }
}
