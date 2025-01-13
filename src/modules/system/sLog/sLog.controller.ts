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
  import { SLogService } from './sLog.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { SLog } from './sLog.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  import { nanoid } from "nanoid";
  
  @ApiTags('接口')
  @Controller('/api/sLog')
  export class SLogController {
    constructor(private readonly sLogService: SLogService) {}
  
    @Post('deleteSLogBatch')
    @ApiOperation({ summary: '删除(批量、递归)' })
    deleteSLogBatch(@Body() idList: string[]) {
      return this.sLogService.deleteBatch(idList);
    }
  
    @Post('downloadSLogTemplate')
    @ApiOperation({ summary: '导出模板下载' })
    async downloadSLogTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.sLogService.downloadSLogTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=category_template.xlsx');
      res.send(buffer);
    }
  
    @Post('getSLog')
    @ApiOperation({ summary: '获取' })
    getSLog(@Query('id') id: string) {
      return this.sLogService.getItem(id);
    }
  
    @Post('importSLogByExcel')
    @ApiOperation({ summary: '导入' })
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
    importSLog(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.sLogService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.sLogService.exportByExcel(query,res);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=sLog.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.sLogService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=sLog.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.sLogService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=sLog.xml');
      res.send(xml);
    }
  
    @Post('insertSLog')
    @ApiOperation({ summary: '增加' })
    insertSLog(@Body() entity: SLog) {
      return this.sLogService.insert(entity);
    }
  
    @Post('insertSLogBatch')
    @ApiOperation({ summary: '增加(批量)' })
    insertSLogBatch(@Body() entity: SLog[]) {
      return this.sLogService.insertBatch(entity);
    }
  
    @Post('querySLog')
    @ApiOperation({ summary: '查询列表结果' })
    querySLog(@Body() condition:QueryCondition) {
      return this.sLogService.queryList(condition)
    }
  
    @Post('saveSLog')
    @ApiOperation({ summary: '保存' })
    saveSLog(@Body() entity: SLog) {
      if(!entity.id){
        entity.id = nanoid()
      }
      return this.sLogService.save(entity);
    }
  
    @Post('saveSLogBatch')
    @ApiOperation({ summary: '保存(批量)' })
    saveSLogBatch(@Body() entity: SLog[]) {
      entity.forEach(entityItem=>{
        if(!entityItem.id){
          entityItem.id = nanoid()
        }
      })
      return this.sLogService.saveBatch(entity);
    }
  
    @Post('updateSLog')
    @ApiOperation({ summary: '修改' })
    updateSLog(@Body() entity: SLog) {
      return this.sLogService.update(entity);
    }
  
    @Post('updateSLogBatch')
    @ApiOperation({ summary: '修改(批量)' })
    updateSLogBatch(@Body() entity: SLog[]) {
      return this.sLogService.updateBatch(entity);
    }
  }
  