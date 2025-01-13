import {
    Controller,
    Post,
    Body,
    Query,
    UploadedFile,
    UseInterceptors,
    Res,
    Req,
  } from '@nestjs/common';
  import { NavToolService } from './navTool.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { NavTool } from './navTool.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  import { nanoid } from "nanoid";
  
  @ApiTags('工具导航接口')
  @Controller('/api/navTool')
  export class NavToolController {
    constructor(private readonly navToolService: NavToolService) {}
  
    @Post('deleteNavToolBatch')
    @ApiOperation({ summary: '删除工具导航(批量、递归)' })
    deleteNavToolBatch(@Body() idList: string[]) {
      return this.navToolService.deleteBatch(idList);
    }
  
    @Post('downloadNavToolTemplate')
    @ApiOperation({ summary: '导出工具导航模板下载' })
    async downloadNavToolTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.navToolService.downloadNavToolTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=category_template.xlsx');
      res.send(buffer);
    }
  
    @Post('getNavTool')
    @ApiOperation({ summary: '获取工具导航' })
    getNavTool(@Query('id') id: string) {
      return this.navToolService.getItem(id);
    }
  
    @Post('importNavToolByExcel')
    @ApiOperation({ summary: '导入工具导航' })
    @UseInterceptors(FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(xlsx|xls)$/)) {
          return callback(new Error('只支持 .xlsx 或 .xls 文件!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5 // 限制5MB
      }
    }))
    @ApiOperation({ summary: '文件上传,返回 url 地址' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            description: '文件',
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    importNavTool(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.navToolService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.navToolService.exportByExcel(query,res);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=navTool.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.navToolService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=navTool.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.navToolService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=navTool.xml');
      res.send(xml);
    }
  
    @Post('insertNavTool')
    @ApiOperation({ summary: '增加工具导航' })
    insertNavTool(@Body() entity: NavTool) {
      return this.navToolService.insert(entity);
    }
  
    @Post('insertNavToolBatch')
    @ApiOperation({ summary: '增加工具导航(批量)' })
    insertNavToolBatch(@Body() entity: NavTool[]) {
      return this.navToolService.insertBatch(entity);
    }
  
    @Post('queryNavTool')
    @ApiOperation({ summary: '查询工具导航列表结果' })
    queryNavTool(@Body() condition:QueryCondition) {
      return this.navToolService.queryList(condition)
    }
  
    @Post('saveNavTool')
    @ApiOperation({ summary: '保存工具导航' })
    saveNavTool(@Body() entity: NavTool) {
      if(!entity.id){
        entity.id = nanoid()
      }
      return this.navToolService.save(entity);
    }
  
    @Post('saveNavToolBatch')
    @ApiOperation({ summary: '保存工具导航(批量)' })
    saveNavToolBatch(@Body() entity: NavTool[]) {
      entity.forEach(entityItem=>{
        if(!entityItem.id){
          entityItem.id = nanoid()
        }
      })
      return this.navToolService.saveBatch(entity);
    }
  
    @Post('updateNavTool')
    @ApiOperation({ summary: '修改工具导航' })
    updateNavTool(@Body() entity: NavTool) {
      return this.navToolService.update(entity);
    }
  
    @Post('updateNavToolBatch')
    @ApiOperation({ summary: '修改工具导航(批量)' })
    updateNavToolBatch(@Body() entity: NavTool[]) {
      return this.navToolService.updateBatch(entity);
    }
  }
  