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
  import { DpEdgeService } from './dpEdge.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { DpEdge } from './dpEdge.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  
  @ApiTags('边接口')
  @Controller('/api/dpEdge')
  export class DpEdgeController {
    constructor(private readonly dpEdgeService: DpEdgeService) {}
  
    @Post('deleteDpEdge')
    @ApiOperation({ summary: '删除边' })
    deleteDpEdge(@Query('id') id: string,@Req() req: Request) {
      return this.dpEdgeService.delete(id,req);
    }

    @Post('deleteDpEdgeBatch')
    @ApiOperation({ summary: '删除边(批量)' })
    deleteDpEdgeBatch(@Body() idList: string[],@Req() req: Request) {
      return this.dpEdgeService.deleteBatch(idList,req);
    }
  
    @Post('downloadDpEdgeTemplate')
    @ApiOperation({ summary: '导出边模板下载' })
    async downloadDpEdgeTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.dpEdgeService.downloadDpEdgeTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=边模板.xlsx');
      res.send(buffer);
    }
  
    @Post('getDpEdge')
    @ApiOperation({ summary: '获取边' })
    getDpEdge(@Query('id') id: string) {
      return this.dpEdgeService.getItem(id);
    }
  
    @Post('importDpEdgeByExcel')
    @ApiOperation({ summary: '导入边' })
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
    importDpEdge(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.dpEdgeService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.dpEdgeService.exportByExcel(query);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=dpEdge.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.dpEdgeService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=dpEdge.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.dpEdgeService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=dpEdge.xml');
      res.send(xml);
    }
  
    @Post('insertDpEdge')
    @ApiOperation({ summary: '增加边' })
    insertDpEdge(@Body() entity: DpEdge,@Req() req: Request) {
      return this.dpEdgeService.insert(entity,req);
    }
  
    @Post('insertDpEdgeBatch')
    @ApiOperation({ summary: '增加边(批量)' })
    insertDpEdgeBatch(@Body() entity: DpEdge[],@Req() req: Request) {
      return this.dpEdgeService.insertBatch(entity,req);
    }
  
    @Post('queryDpEdgeDTOByCondition')
    @ApiOperation({ summary: '查询边列表结果' })
    queryDpEdge(@Body() condition:QueryCondition) {
      return this.dpEdgeService.queryList(condition)
    }
  
    @Post('saveDpEdge')
    @ApiOperation({ summary: '保存边' })
    saveDpEdge(@Body() entity: DpEdge,@Req() req: Request) {
      return this.dpEdgeService.save(entity,req);
    }
  
    @Post('saveDpEdgeBatch')
    @ApiOperation({ summary: '保存边(批量)' })
    saveDpEdgeBatch(@Body() obj: any,@Req() req: Request) {
      return this.dpEdgeService.saveBatch(obj.newDTOList,obj.oldDTOIdList,req); 
    }
    @Post('updateDpEdge')
    @ApiOperation({ summary: '修改边' })
    updateDpEdge(@Body() entity: DpEdge,@Req() req: Request) {
      return this.dpEdgeService.update(entity,req);
    }
  
    @Post('updateDpEdgeBatch')
    @ApiOperation({ summary: '修改边(批量)' })
    updateDpEdgeBatch(@Body() entity: DpEdge[],@Req() req: Request) {
        return this.dpEdgeService.updateBatch(entity,req);
    }
  }
  