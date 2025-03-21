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
  import { DpNodeService } from './dpNode.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { DpNode } from './dpNode.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  
  @ApiTags('节点接口')
  @Controller('/api/dpNode')
  export class DpNodeController {
    constructor(private readonly dpNodeService: DpNodeService) {}
  
    @Post('deleteDpNode')
    @ApiOperation({ summary: '删除节点' })
    deleteDpNode(@Query('id') id: string,@Req() req: Request) {
      return this.dpNodeService.delete(id,req);
    }

    @Post('deleteDpNodeBatch')
    @ApiOperation({ summary: '删除节点(批量)' })
    deleteDpNodeBatch(@Body() idList: string[],@Req() req: Request) {
      return this.dpNodeService.deleteBatch(idList,req);
    }
  
    @Post('downloadDpNodeTemplate')
    @ApiOperation({ summary: '导出节点模板下载' })
    async downloadDpNodeTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.dpNodeService.downloadDpNodeTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=节点模板.xlsx');
      res.send(buffer);
    }
  
    @Post('getDpNode')
    @ApiOperation({ summary: '获取节点' })
    getDpNode(@Query('id') id: string) {
      return this.dpNodeService.getItem(id);
    }
  
    @Post('importDpNodeByExcel')
    @ApiOperation({ summary: '导入节点' })
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
    importDpNode(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.dpNodeService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.dpNodeService.exportByExcel(query);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=dpNode.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.dpNodeService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=dpNode.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.dpNodeService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=dpNode.xml');
      res.send(xml);
    }
  
    @Post('insertDpNode')
    @ApiOperation({ summary: '增加节点' })
    insertDpNode(@Body() entity: DpNode,@Req() req: Request) {
      return this.dpNodeService.insert(entity,req);
    }
  
    @Post('insertDpNodeBatch')
    @ApiOperation({ summary: '增加节点(批量)' })
    insertDpNodeBatch(@Body() entity: DpNode[],@Req() req: Request) {
      return this.dpNodeService.insertBatch(entity,req);
    }
  
    @Post('queryDpNodeDTOByCondition')
    @ApiOperation({ summary: '查询节点列表结果' })
    queryDpNode(@Body() condition:QueryCondition) {
      return this.dpNodeService.queryList(condition)
    }
  
    @Post('saveDpNode')
    @ApiOperation({ summary: '保存节点' })
    saveDpNode(@Body() entity: DpNode,@Req() req: Request) {
      return this.dpNodeService.save(entity,req);
    }
  
    @Post('saveDpNodeBatch')
    @ApiOperation({ summary: '保存节点(批量)' })
    saveDpNodeBatch(@Body() obj: any,@Req() req: Request) {
      return this.dpNodeService.saveBatch(obj.newDTOList,obj.oldDTOIdList,req); 
    }
    @Post('updateDpNode')
    @ApiOperation({ summary: '修改节点' })
    updateDpNode(@Body() entity: DpNode,@Req() req: Request) {
      return this.dpNodeService.update(entity,req);
    }
  
    @Post('updateDpNodeBatch')
    @ApiOperation({ summary: '修改节点(批量)' })
    updateDpNodeBatch(@Body() entity: DpNode[],@Req() req: Request) {
        return this.dpNodeService.updateBatch(entity,req);
    }
  }
  