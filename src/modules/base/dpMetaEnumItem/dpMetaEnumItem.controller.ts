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
  import { DpMetaEnumItemService } from './dpMetaEnumItem.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { DpMetaEnumItem } from './dpMetaEnumItem.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  
  @ApiTags('枚举项接口')
  @Controller('/api/dpMetaEnumItem')
  export class DpMetaEnumItemController {
    constructor(private readonly dpMetaEnumItemService: DpMetaEnumItemService) {}
  
    @Post('deleteDpMetaEnumItem')
    @ApiOperation({ summary: '删除枚举项' })
    deleteDpMetaEnumItem(@Query('id') id: string,@Req() req: Request) {
      return this.dpMetaEnumItemService.delete(id,req);
    }

    @Post('deleteDpMetaEnumItemBatch')
    @ApiOperation({ summary: '删除枚举项(批量)' })
    deleteDpMetaEnumItemBatch(@Body() idList: string[],@Req() req: Request) {
      return this.dpMetaEnumItemService.deleteBatch(idList,req);
    }
  
    @Post('downloadDpMetaEnumItemTemplate')
    @ApiOperation({ summary: '导出枚举项模板下载' })
    async downloadDpMetaEnumItemTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.dpMetaEnumItemService.downloadDpMetaEnumItemTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=枚举项模板.xlsx');
      res.send(buffer);
    }
  
    @Post('getDpMetaEnumItem')
    @ApiOperation({ summary: '获取枚举项' })
    getDpMetaEnumItem(@Query('id') id: string) {
      return this.dpMetaEnumItemService.getItem(id);
    }
  
    @Post('importDpMetaEnumItemByExcel')
    @ApiOperation({ summary: '导入枚举项' })
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
    importDpMetaEnumItem(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.dpMetaEnumItemService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.dpMetaEnumItemService.exportByExcel(query);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMetaEnumItem.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.dpMetaEnumItemService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMetaEnumItem.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.dpMetaEnumItemService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMetaEnumItem.xml');
      res.send(xml);
    }
  
    @Post('insertDpMetaEnumItem')
    @ApiOperation({ summary: '增加枚举项' })
    insertDpMetaEnumItem(@Body() entity: DpMetaEnumItem,@Req() req: Request) {
      return this.dpMetaEnumItemService.insert(entity,req);
    }
  
    @Post('insertDpMetaEnumItemBatch')
    @ApiOperation({ summary: '增加枚举项(批量)' })
    insertDpMetaEnumItemBatch(@Body() entity: DpMetaEnumItem[],@Req() req: Request) {
      return this.dpMetaEnumItemService.insertBatch(entity,req);
    }
  
    @Post('queryDpMetaEnumItemDTOByCondition')
    @ApiOperation({ summary: '查询枚举项列表结果' })
    queryDpMetaEnumItem(@Body() condition:QueryCondition) {
      return this.dpMetaEnumItemService.queryList(condition)
    }
  
    @Post('saveDpMetaEnumItem')
    @ApiOperation({ summary: '保存枚举项' })
    saveDpMetaEnumItem(@Body() entity: DpMetaEnumItem,@Req() req: Request) {
      return this.dpMetaEnumItemService.save(entity,req);
    }
  
    @Post('saveDpMetaEnumItemBatch')
    @ApiOperation({ summary: '保存枚举项(批量)' })
    saveDpMetaEnumItemBatch(@Body() obj: any,@Req() req: Request) {
      return this.dpMetaEnumItemService.saveBatch(obj.newDTOList,obj.oldDTOIdList,req); 
    }
    @Post('updateDpMetaEnumItem')
    @ApiOperation({ summary: '修改枚举项' })
    updateDpMetaEnumItem(@Body() entity: DpMetaEnumItem,@Req() req: Request) {
      return this.dpMetaEnumItemService.update(entity,req);
    }
  
    @Post('updateDpMetaEnumItemBatch')
    @ApiOperation({ summary: '修改枚举项(批量)' })
    updateDpMetaEnumItemBatch(@Body() entity: DpMetaEnumItem[],@Req() req: Request) {
        return this.dpMetaEnumItemService.updateBatch(entity,req);
    }
  }
  