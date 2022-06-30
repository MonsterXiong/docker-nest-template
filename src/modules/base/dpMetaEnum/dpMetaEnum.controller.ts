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
  import { DpMetaEnumService } from './dpMetaEnum.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { DpMetaEnum } from './dpMetaEnum.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  
  @ApiTags('枚举接口')
  @Controller('/api/dpMetaEnum')
  export class DpMetaEnumController {
    constructor(private readonly dpMetaEnumService: DpMetaEnumService) {}
  
    @Post('deleteDpMetaEnum')
    @ApiOperation({ summary: '删除枚举' })
    deleteDpMetaEnum(@Query('id') id: string,@Req() req: Request) {
      return this.dpMetaEnumService.delete(id,req);
    }

    @Post('deleteDpMetaEnumBatch')
    @ApiOperation({ summary: '删除枚举(批量)' })
    deleteDpMetaEnumBatch(@Body() idList: string[],@Req() req: Request) {
      return this.dpMetaEnumService.deleteBatch(idList,req);
    }
  
    @Post('downloadDpMetaEnumTemplate')
    @ApiOperation({ summary: '导出枚举模板下载' })
    async downloadDpMetaEnumTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.dpMetaEnumService.downloadDpMetaEnumTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=枚举模板.xlsx');
      res.send(buffer);
    }
  
    @Post('getDpMetaEnum')
    @ApiOperation({ summary: '获取枚举' })
    getDpMetaEnum(@Query('id') id: string) {
      return this.dpMetaEnumService.getItem(id);
    }
  
    @Post('importDpMetaEnumByExcel')
    @ApiOperation({ summary: '导入枚举' })
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
    importDpMetaEnum(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.dpMetaEnumService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.dpMetaEnumService.exportByExcel(query);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMetaEnum.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.dpMetaEnumService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMetaEnum.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.dpMetaEnumService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMetaEnum.xml');
      res.send(xml);
    }
  
    @Post('insertDpMetaEnum')
    @ApiOperation({ summary: '增加枚举' })
    insertDpMetaEnum(@Body() entity: DpMetaEnum,@Req() req: Request) {
      return this.dpMetaEnumService.insert(entity,req);
    }
  
    @Post('insertDpMetaEnumBatch')
    @ApiOperation({ summary: '增加枚举(批量)' })
    insertDpMetaEnumBatch(@Body() entity: DpMetaEnum[],@Req() req: Request) {
      return this.dpMetaEnumService.insertBatch(entity,req);
    }
  
    @Post('queryDpMetaEnumDTOByCondition')
    @ApiOperation({ summary: '查询枚举列表结果' })
    queryDpMetaEnum(@Body() condition:QueryCondition) {
      return this.dpMetaEnumService.queryList(condition)
    }
  
    @Post('saveDpMetaEnum')
    @ApiOperation({ summary: '保存枚举' })
    saveDpMetaEnum(@Body() entity: DpMetaEnum,@Req() req: Request) {
      return this.dpMetaEnumService.save(entity,req);
    }
  
    @Post('saveDpMetaEnumBatch')
    @ApiOperation({ summary: '保存枚举(批量)' })
    saveDpMetaEnumBatch(@Body() obj: any,@Req() req: Request) {
      return this.dpMetaEnumService.saveBatch(obj.newDTOList,obj.oldDTOIdList,req); 
    }
    @Post('updateDpMetaEnum')
    @ApiOperation({ summary: '修改枚举' })
    updateDpMetaEnum(@Body() entity: DpMetaEnum,@Req() req: Request) {
      return this.dpMetaEnumService.update(entity,req);
    }
  
    @Post('updateDpMetaEnumBatch')
    @ApiOperation({ summary: '修改枚举(批量)' })
    updateDpMetaEnumBatch(@Body() entity: DpMetaEnum[],@Req() req: Request) {
        return this.dpMetaEnumService.updateBatch(entity,req);
    }
  }
  