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
  import { DpMetaEntityService } from './dpMetaEntity.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { DpMetaEntity } from './dpMetaEntity.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  
  @ApiTags('元对象接口')
  @Controller('/api/dpMetaEntity')
  export class DpMetaEntityController {
    constructor(private readonly dpMetaEntityService: DpMetaEntityService) {}
  
    @Post('deleteDpMetaEntity')
    @ApiOperation({ summary: '删除元对象' })
    deleteDpMetaEntity(@Query('id') id: string,@Req() req: Request) {
      return this.dpMetaEntityService.delete(id,req);
    }

    @Post('deleteDpMetaEntityBatch')
    @ApiOperation({ summary: '删除元对象(批量)' })
    deleteDpMetaEntityBatch(@Body() idList: string[],@Req() req: Request) {
      return this.dpMetaEntityService.deleteBatch(idList,req);
    }
  
    @Post('downloadDpMetaEntityTemplate')
    @ApiOperation({ summary: '导出元对象模板下载' })
    async downloadDpMetaEntityTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.dpMetaEntityService.downloadDpMetaEntityTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=元对象模板.xlsx');
      res.send(buffer);
    }
  
    @Post('getDpMetaEntity')
    @ApiOperation({ summary: '获取元对象' })
    getDpMetaEntity(@Query('id') id: string) {
      return this.dpMetaEntityService.getItem(id);
    }
  
    @Post('importDpMetaEntityByExcel')
    @ApiOperation({ summary: '导入元对象' })
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
    importDpMetaEntity(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.dpMetaEntityService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.dpMetaEntityService.exportByExcel(query);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMetaEntity.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.dpMetaEntityService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMetaEntity.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.dpMetaEntityService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMetaEntity.xml');
      res.send(xml);
    }
  
    @Post('insertDpMetaEntity')
    @ApiOperation({ summary: '增加元对象' })
    insertDpMetaEntity(@Body() entity: DpMetaEntity,@Req() req: Request) {
      return this.dpMetaEntityService.insert(entity,req);
    }
  
    @Post('insertDpMetaEntityBatch')
    @ApiOperation({ summary: '增加元对象(批量)' })
    insertDpMetaEntityBatch(@Body() entity: DpMetaEntity[],@Req() req: Request) {
      return this.dpMetaEntityService.insertBatch(entity,req);
    }
  
    @Post('queryDpMetaEntityDTOByCondition')
    @ApiOperation({ summary: '查询元对象列表结果' })
    queryDpMetaEntity(@Body() condition:QueryCondition) {
      return this.dpMetaEntityService.queryList(condition)
    }
  
    @Post('saveDpMetaEntity')
    @ApiOperation({ summary: '保存元对象' })
    saveDpMetaEntity(@Body() entity: DpMetaEntity,@Req() req: Request) {
      return this.dpMetaEntityService.save(entity,req);
    }
  
    @Post('saveDpMetaEntityBatch')
    @ApiOperation({ summary: '保存元对象(批量)' })
    saveDpMetaEntityBatch(@Body() obj: any,@Req() req: Request) {
      return this.dpMetaEntityService.saveBatch(obj.newDTOList,obj.oldDTOIdList,req); 
    }
    @Post('updateDpMetaEntity')
    @ApiOperation({ summary: '修改元对象' })
    updateDpMetaEntity(@Body() entity: DpMetaEntity,@Req() req: Request) {
      return this.dpMetaEntityService.update(entity,req);
    }
  
    @Post('updateDpMetaEntityBatch')
    @ApiOperation({ summary: '修改元对象(批量)' })
    updateDpMetaEntityBatch(@Body() entity: DpMetaEntity[],@Req() req: Request) {
        return this.dpMetaEntityService.updateBatch(entity,req);
    }
  }
  