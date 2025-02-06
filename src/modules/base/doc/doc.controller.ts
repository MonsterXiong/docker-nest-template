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
  import { DocService } from './doc.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { Doc } from './doc.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  
  @ApiTags('文档接口')
  @Controller('/api/doc')
  export class DocController {
    constructor(private readonly docService: DocService) {}
  
    @Post('deleteDoc')
    @ApiOperation({ summary: '删除文档' })
    deleteDoc(@Query('id') id: string,@Req() req: Request) {
      return this.docService.delete(id,req);
    }

    @Post('deleteDocBatch')
    @ApiOperation({ summary: '删除文档(批量)' })
    deleteDocBatch(@Body() idList: string[],@Req() req: Request) {
      return this.docService.deleteBatch(idList,req);
    }
  
    @Post('downloadDocTemplate')
    @ApiOperation({ summary: '导出文档模板下载' })
    async downloadDocTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.docService.downloadDocTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=doc_template.xlsx');
      res.send(buffer);
    }
  
    @Post('getDoc')
    @ApiOperation({ summary: '获取文档' })
    getDoc(@Query('id') id: string) {
      return this.docService.getItem(id);
    }
  
    @Post('importDocByExcel')
    @ApiOperation({ summary: '导入文档' })
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
    importDoc(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.docService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.docService.exportByExcel(query);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=doc.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.docService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=doc.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.docService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=doc.xml');
      res.send(xml);
    }
  
    @Post('insertDoc')
    @ApiOperation({ summary: '增加文档' })
    insertDoc(@Body() entity: Doc,@Req() req: Request) {
      return this.docService.insert(entity,req);
    }
  
    @Post('insertDocBatch')
    @ApiOperation({ summary: '增加文档(批量)' })
    insertDocBatch(@Body() entity: Doc[],@Req() req: Request) {
      return this.docService.insertBatch(entity,req);
    }
  
    @Post('queryDocDtoByCondition')
    @ApiOperation({ summary: '查询文档列表结果' })
    queryDoc(@Body() condition:QueryCondition) {
      return this.docService.queryList(condition)
    }
  
    @Post('saveDoc')
    @ApiOperation({ summary: '保存文档' })
    saveDoc(@Body() entity: Doc,@Req() req: Request) {
      return this.docService.save(entity,req);
    }
  
    @Post('saveDocBatch')
    @ApiOperation({ summary: '保存文档(批量)' })
    saveDocBatch(@Body() entity: Doc[],@Req() req: Request) {
      return this.docService.saveBatch(entity,req); 
    }
  
    @Post('updateDoc')
    @ApiOperation({ summary: '修改文档' })
    updateDoc(@Body() entity: Doc,@Req() req: Request) {
      return this.docService.update(entity,req);
    }
  
    @Post('updateDocBatch')
    @ApiOperation({ summary: '修改文档(批量)' })
    updateDocBatch(@Body() entity: Doc[],@Req() req: Request) {
        return this.docService.updateBatch(entity,req);
    }
  }
  