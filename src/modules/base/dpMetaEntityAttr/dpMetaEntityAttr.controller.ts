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
  import { DpMetaEntityAttrService } from './dpMetaEntityAttr.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { DpMetaEntityAttr } from './dpMetaEntityAttr.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  
  @ApiTags('元对象属性接口')
  @Controller('/api/dpMetaEntityAttr')
  export class DpMetaEntityAttrController {
    constructor(private readonly dpMetaEntityAttrService: DpMetaEntityAttrService) {}
  
    @Post('deleteDpMetaEntityAttr')
    @ApiOperation({ summary: '删除元对象属性' })
    deleteDpMetaEntityAttr(@Query('id') id: string,@Req() req: Request) {
      return this.dpMetaEntityAttrService.delete(id,req);
    }

    @Post('deleteDpMetaEntityAttrBatch')
    @ApiOperation({ summary: '删除元对象属性(批量)' })
    deleteDpMetaEntityAttrBatch(@Body() idList: string[],@Req() req: Request) {
      return this.dpMetaEntityAttrService.deleteBatch(idList,req);
    }
  
    @Post('downloadDpMetaEntityAttrTemplate')
    @ApiOperation({ summary: '导出元对象属性模板下载' })
    async downloadDpMetaEntityAttrTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.dpMetaEntityAttrService.downloadDpMetaEntityAttrTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=元对象属性模板.xlsx');
      res.send(buffer);
    }
  
    @Post('getDpMetaEntityAttr')
    @ApiOperation({ summary: '获取元对象属性' })
    getDpMetaEntityAttr(@Query('id') id: string) {
      return this.dpMetaEntityAttrService.getItem(id);
    }
  
    @Post('importDpMetaEntityAttrByExcel')
    @ApiOperation({ summary: '导入元对象属性' })
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
    importDpMetaEntityAttr(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.dpMetaEntityAttrService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.dpMetaEntityAttrService.exportByExcel(query);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMetaEntityAttr.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.dpMetaEntityAttrService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMetaEntityAttr.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.dpMetaEntityAttrService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMetaEntityAttr.xml');
      res.send(xml);
    }
  
    @Post('insertDpMetaEntityAttr')
    @ApiOperation({ summary: '增加元对象属性' })
    insertDpMetaEntityAttr(@Body() entity: DpMetaEntityAttr,@Req() req: Request) {
      return this.dpMetaEntityAttrService.insert(entity,req);
    }
  
    @Post('insertDpMetaEntityAttrBatch')
    @ApiOperation({ summary: '增加元对象属性(批量)' })
    insertDpMetaEntityAttrBatch(@Body() entity: DpMetaEntityAttr[],@Req() req: Request) {
      return this.dpMetaEntityAttrService.insertBatch(entity,req);
    }
  
    @Post('queryDpMetaEntityAttrDTOByCondition')
    @ApiOperation({ summary: '查询元对象属性列表结果' })
    queryDpMetaEntityAttr(@Body() condition:QueryCondition) {
      return this.dpMetaEntityAttrService.queryList(condition)
    }
  
    @Post('saveDpMetaEntityAttr')
    @ApiOperation({ summary: '保存元对象属性' })
    saveDpMetaEntityAttr(@Body() entity: DpMetaEntityAttr,@Req() req: Request) {
      return this.dpMetaEntityAttrService.save(entity,req);
    }
  
    @Post('saveDpMetaEntityAttrBatch')
    @ApiOperation({ summary: '保存元对象属性(批量)' })
    saveDpMetaEntityAttrBatch(@Body() obj: any,@Req() req: Request) {
      return this.dpMetaEntityAttrService.saveBatch(obj.newDTOList,obj.oldDTOIdList,req); 
    }
    @Post('updateDpMetaEntityAttr')
    @ApiOperation({ summary: '修改元对象属性' })
    updateDpMetaEntityAttr(@Body() entity: DpMetaEntityAttr,@Req() req: Request) {
      return this.dpMetaEntityAttrService.update(entity,req);
    }
  
    @Post('updateDpMetaEntityAttrBatch')
    @ApiOperation({ summary: '修改元对象属性(批量)' })
    updateDpMetaEntityAttrBatch(@Body() entity: DpMetaEntityAttr[],@Req() req: Request) {
        return this.dpMetaEntityAttrService.updateBatch(entity,req);
    }
  }
  