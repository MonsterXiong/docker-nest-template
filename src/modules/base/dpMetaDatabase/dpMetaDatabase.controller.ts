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
  import { DpMetaDatabaseService } from './dpMetaDatabase.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { DpMetaDatabase } from './dpMetaDatabase.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  
  @ApiTags('元数据体系接口')
  @Controller('/api/dpMetaDatabase')
  export class DpMetaDatabaseController {
    constructor(private readonly dpMetaDatabaseService: DpMetaDatabaseService) {}
  
    @Post('deleteDpMetaDatabase')
    @ApiOperation({ summary: '删除元数据体系' })
    deleteDpMetaDatabase(@Query('id') id: string,@Req() req: Request) {
      return this.dpMetaDatabaseService.delete(id,req);
    }

    @Post('deleteDpMetaDatabaseBatch')
    @ApiOperation({ summary: '删除元数据体系(批量)' })
    deleteDpMetaDatabaseBatch(@Body() idList: string[],@Req() req: Request) {
      return this.dpMetaDatabaseService.deleteBatch(idList,req);
    }
  
    @Post('downloadDpMetaDatabaseTemplate')
    @ApiOperation({ summary: '导出元数据体系模板下载' })
    async downloadDpMetaDatabaseTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.dpMetaDatabaseService.downloadDpMetaDatabaseTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=元数据体系模板.xlsx');
      res.send(buffer);
    }
  
    @Post('getDpMetaDatabase')
    @ApiOperation({ summary: '获取元数据体系' })
    getDpMetaDatabase(@Query('id') id: string) {
      return this.dpMetaDatabaseService.getItem(id);
    }
  
    @Post('importDpMetaDatabaseByExcel')
    @ApiOperation({ summary: '导入元数据体系' })
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
    importDpMetaDatabase(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.dpMetaDatabaseService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.dpMetaDatabaseService.exportByExcel(query);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMetaDatabase.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.dpMetaDatabaseService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMetaDatabase.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.dpMetaDatabaseService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMetaDatabase.xml');
      res.send(xml);
    }
  
    @Post('insertDpMetaDatabase')
    @ApiOperation({ summary: '增加元数据体系' })
    insertDpMetaDatabase(@Body() entity: DpMetaDatabase,@Req() req: Request) {
      return this.dpMetaDatabaseService.insert(entity,req);
    }
  
    @Post('insertDpMetaDatabaseBatch')
    @ApiOperation({ summary: '增加元数据体系(批量)' })
    insertDpMetaDatabaseBatch(@Body() entity: DpMetaDatabase[],@Req() req: Request) {
      return this.dpMetaDatabaseService.insertBatch(entity,req);
    }
  
    @Post('queryDpMetaDatabaseDTOByCondition')
    @ApiOperation({ summary: '查询元数据体系列表结果' })
    queryDpMetaDatabase(@Body() condition:QueryCondition) {
      return this.dpMetaDatabaseService.queryList(condition)
    }
  
    @Post('saveDpMetaDatabase')
    @ApiOperation({ summary: '保存元数据体系' })
    saveDpMetaDatabase(@Body() entity: DpMetaDatabase,@Req() req: Request) {
      return this.dpMetaDatabaseService.save(entity,req);
    }
  
    @Post('saveDpMetaDatabaseBatch')
    @ApiOperation({ summary: '保存元数据体系(批量)' })
    saveDpMetaDatabaseBatch(@Body() obj: any,@Req() req: Request) {
      return this.dpMetaDatabaseService.saveBatch(obj.newDTOList,obj.oldDTOIdList,req); 
    }
    @Post('updateDpMetaDatabase')
    @ApiOperation({ summary: '修改元数据体系' })
    updateDpMetaDatabase(@Body() entity: DpMetaDatabase,@Req() req: Request) {
      return this.dpMetaDatabaseService.update(entity,req);
    }
  
    @Post('updateDpMetaDatabaseBatch')
    @ApiOperation({ summary: '修改元数据体系(批量)' })
    updateDpMetaDatabaseBatch(@Body() entity: DpMetaDatabase[],@Req() req: Request) {
        return this.dpMetaDatabaseService.updateBatch(entity,req);
    }
  }
  