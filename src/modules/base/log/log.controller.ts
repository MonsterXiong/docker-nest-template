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
  import { LogService } from './log.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { Log } from './log.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  import { nanoid } from "nanoid";
  
  @ApiTags('日志接口')
  @Controller('/api/log')
  export class LogController {
    constructor(private readonly logService: LogService) {}
  
    @Post('deleteLogBatch')
    @ApiOperation({ summary: '删除日志(批量、递归)' })
    deleteLogBatch(@Body() idList: string[]) {
      return this.logService.deleteBatch(idList);
    }
  
    @Post('downloadLogTemplate')
    @ApiOperation({ summary: '导出日志模板下载' })
    async downloadLogTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.logService.downloadLogTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=category_template.xlsx');
      res.send(buffer);
    }
  
    @Post('getLog')
    @ApiOperation({ summary: '获取日志' })
    getLog(@Query('id') id: string) {
      return this.logService.getItem(id);
    }
  
    @Post('importLogByExcel')
    @ApiOperation({ summary: '导入日志' })
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
    importLog(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.logService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.logService.exportByExcel(query,res);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=log.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.logService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=log.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.logService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=log.xml');
      res.send(xml);
    }
  
    @Post('insertLog')
    @ApiOperation({ summary: '增加日志' })
    insertLog(@Body() entity: Log) {
      return this.logService.insert(entity);
    }
  
    @Post('insertLogBatch')
    @ApiOperation({ summary: '增加日志(批量)' })
    insertLogBatch(@Body() entity: Log[]) {
      return this.logService.insertBatch(entity);
    }
  
    @Post('queryLog')
    @ApiOperation({ summary: '查询日志列表结果' })
    queryLog(@Body() condition:QueryCondition) {
      return this.logService.queryList(condition)
    }
  
    @Post('saveLog')
    @ApiOperation({ summary: '保存日志' })
    saveLog(@Body() entity: Log) {
      if(!entity.id){
        entity.id = nanoid()
      }
      return this.logService.save(entity);
    }
  
    @Post('saveLogBatch')
    @ApiOperation({ summary: '保存日志(批量)' })
    saveLogBatch(@Body() entity: Log[]) {
      entity.forEach(entityItem=>{
        if(!entityItem.id){
          entityItem.id = nanoid()
        }
      })
      return this.logService.saveBatch(entity);
    }
  
    @Post('updateLog')
    @ApiOperation({ summary: '修改日志' })
    updateLog(@Body() entity: Log) {
      return this.logService.update(entity);
    }
  
    @Post('updateLogBatch')
    @ApiOperation({ summary: '修改日志(批量)' })
    updateLogBatch(@Body() entity: Log[]) {
      return this.logService.updateBatch(entity);
    }
  }
  