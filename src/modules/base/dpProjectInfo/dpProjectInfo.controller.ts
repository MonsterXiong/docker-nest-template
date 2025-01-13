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
  import { DpProjectInfoService } from './dpProjectInfo.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { DpProjectInfo } from './dpProjectInfo.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  import { nanoid } from "nanoid";
  
  @ApiTags('接口')
  @Controller('/api/dpProjectInfo')
  export class DpProjectInfoController {
    constructor(private readonly dpProjectInfoService: DpProjectInfoService) {}
  
    @Post('deleteDpProjectInfoBatch')
    @ApiOperation({ summary: '删除(批量、递归)' })
    deleteDpProjectInfoBatch(@Body() idList: string[]) {
      return this.dpProjectInfoService.deleteBatch(idList);
    }
  
    @Post('downloadDpProjectInfoTemplate')
    @ApiOperation({ summary: '导出模板下载' })
    async downloadDpProjectInfoTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.dpProjectInfoService.downloadDpProjectInfoTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=category_template.xlsx');
      res.send(buffer);
    }
  
    @Post('getDpProjectInfo')
    @ApiOperation({ summary: '获取' })
    getDpProjectInfo(@Query('id') id: string) {
      return this.dpProjectInfoService.getItem(id);
    }
  
    @Post('importDpProjectInfoByExcel')
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
    importDpProjectInfo(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.dpProjectInfoService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.dpProjectInfoService.exportByExcel(query,res);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=dpProjectInfo.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.dpProjectInfoService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=dpProjectInfo.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.dpProjectInfoService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=dpProjectInfo.xml');
      res.send(xml);
    }
  
    @Post('insertDpProjectInfo')
    @ApiOperation({ summary: '增加' })
    insertDpProjectInfo(@Body() entity: DpProjectInfo) {
      return this.dpProjectInfoService.insert(entity);
    }
  
    @Post('insertDpProjectInfoBatch')
    @ApiOperation({ summary: '增加(批量)' })
    insertDpProjectInfoBatch(@Body() entity: DpProjectInfo[]) {
      return this.dpProjectInfoService.insertBatch(entity);
    }
  
    @Post('queryDpProjectInfo')
    @ApiOperation({ summary: '查询列表结果' })
    queryDpProjectInfo(@Body() condition:QueryCondition) {
      return this.dpProjectInfoService.queryList(condition)
    }
  
    @Post('saveDpProjectInfo')
    @ApiOperation({ summary: '保存' })
    saveDpProjectInfo(@Body() entity: DpProjectInfo) {
      if(!entity.id){
        entity.id = nanoid()
      }
      return this.dpProjectInfoService.save(entity);
    }
  
    @Post('saveDpProjectInfoBatch')
    @ApiOperation({ summary: '保存(批量)' })
    saveDpProjectInfoBatch(@Body() entity: DpProjectInfo[]) {
      entity.forEach(entityItem=>{
        if(!entityItem.id){
          entityItem.id = nanoid()
        }
      })
      return this.dpProjectInfoService.saveBatch(entity);
    }
  
    @Post('updateDpProjectInfo')
    @ApiOperation({ summary: '修改' })
    updateDpProjectInfo(@Body() entity: DpProjectInfo) {
      return this.dpProjectInfoService.update(entity);
    }
  
    @Post('updateDpProjectInfoBatch')
    @ApiOperation({ summary: '修改(批量)' })
    updateDpProjectInfoBatch(@Body() entity: DpProjectInfo[]) {
      return this.dpProjectInfoService.updateBatch(entity);
    }
  }
  