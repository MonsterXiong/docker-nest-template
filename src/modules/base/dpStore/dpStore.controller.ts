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
  import { DpStoreService } from './dpStore.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { DpStore } from './dpStore.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  
  @ApiTags('全局状态接口')
  @Controller('/api/dpStore')
  export class DpStoreController {
    constructor(private readonly dpStoreService: DpStoreService) {}
  
    @Post('deleteDpStore')
    @ApiOperation({ summary: '删除全局状态' })
    deleteDpStore(@Query('id') id: string,@Req() req: Request) {
      return this.dpStoreService.delete(id,req);
    }

    @Post('deleteDpStoreBatch')
    @ApiOperation({ summary: '删除全局状态(批量)' })
    deleteDpStoreBatch(@Body() idList: string[],@Req() req: Request) {
      return this.dpStoreService.deleteBatch(idList,req);
    }
  
    @Post('downloadDpStoreTemplate')
    @ApiOperation({ summary: '导出全局状态模板下载' })
    async downloadDpStoreTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.dpStoreService.downloadDpStoreTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=全局状态模板.xlsx');
      res.send(buffer);
    }
  
    @Post('getDpStore')
    @ApiOperation({ summary: '获取全局状态' })
    getDpStore(@Query('id') id: string) {
      return this.dpStoreService.getItem(id);
    }
  
    @Post('importDpStoreByExcel')
    @ApiOperation({ summary: '导入全局状态' })
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
    importDpStore(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.dpStoreService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.dpStoreService.exportByExcel(query);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=dpStore.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.dpStoreService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=dpStore.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.dpStoreService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=dpStore.xml');
      res.send(xml);
    }
  
    @Post('insertDpStore')
    @ApiOperation({ summary: '增加全局状态' })
    insertDpStore(@Body() entity: DpStore,@Req() req: Request) {
      return this.dpStoreService.insert(entity,req);
    }
  
    @Post('insertDpStoreBatch')
    @ApiOperation({ summary: '增加全局状态(批量)' })
    insertDpStoreBatch(@Body() entity: DpStore[],@Req() req: Request) {
      return this.dpStoreService.insertBatch(entity,req);
    }
  
    @Post('queryDpStoreDTOByCondition')
    @ApiOperation({ summary: '查询全局状态列表结果' })
    queryDpStore(@Body() condition:QueryCondition) {
      return this.dpStoreService.queryList(condition)
    }
  
    @Post('saveDpStore')
    @ApiOperation({ summary: '保存全局状态' })
    saveDpStore(@Body() entity: DpStore,@Req() req: Request) {
      return this.dpStoreService.save(entity,req);
    }
  
    @Post('saveDpStoreBatch')
    @ApiOperation({ summary: '保存全局状态(批量)' })
    saveDpStoreBatch(@Body() obj: any,@Req() req: Request) {
      return this.dpStoreService.saveBatch(obj.newDTOList,obj.oldDTOIdList,req); 
    }
    @Post('updateDpStore')
    @ApiOperation({ summary: '修改全局状态' })
    updateDpStore(@Body() entity: DpStore,@Req() req: Request) {
      return this.dpStoreService.update(entity,req);
    }
  
    @Post('updateDpStoreBatch')
    @ApiOperation({ summary: '修改全局状态(批量)' })
    updateDpStoreBatch(@Body() entity: DpStore[],@Req() req: Request) {
        return this.dpStoreService.updateBatch(entity,req);
    }
  }
  