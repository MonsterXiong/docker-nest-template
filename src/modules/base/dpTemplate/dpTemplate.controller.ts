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
  import { DpTemplateService } from './dpTemplate.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { DpTemplate } from './dpTemplate.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  import { nanoid } from "nanoid";
  
  @ApiTags('接口')
  @Controller('/api/dpTemplate')
  export class DpTemplateController {
    constructor(private readonly dpTemplateService: DpTemplateService) {}
  
    @Post('deleteDpTemplateBatch')
    @ApiOperation({ summary: '删除(批量、递归)' })
    deleteDpTemplateBatch(@Body() idList: string[]) {
      return this.dpTemplateService.deleteBatch(idList);
    }
  
    @Post('downloadDpTemplateTemplate')
    @ApiOperation({ summary: '导出模板下载' })
    async downloadDpTemplateTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.dpTemplateService.downloadDpTemplateTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=category_template.xlsx');
      res.send(buffer);
    }
  
    @Post('getDpTemplate')
    @ApiOperation({ summary: '获取' })
    getDpTemplate(@Query('id') id: string) {
      return this.dpTemplateService.getItem(id);
    }
  
    @Post('importDpTemplateByExcel')
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
    importDpTemplate(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.dpTemplateService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.dpTemplateService.exportByExcel(query,res);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=dpTemplate.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.dpTemplateService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=dpTemplate.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.dpTemplateService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=dpTemplate.xml');
      res.send(xml);
    }
  
    @Post('insertDpTemplate')
    @ApiOperation({ summary: '增加' })
    insertDpTemplate(@Body() entity: DpTemplate) {
      return this.dpTemplateService.insert(entity);
    }
  
    @Post('insertDpTemplateBatch')
    @ApiOperation({ summary: '增加(批量)' })
    insertDpTemplateBatch(@Body() entity: DpTemplate[]) {
      return this.dpTemplateService.insertBatch(entity);
    }
  
    @Post('queryDpTemplate')
    @ApiOperation({ summary: '查询列表结果' })
    queryDpTemplate(@Body() condition:QueryCondition) {
      return this.dpTemplateService.queryList(condition)
    }
  
    @Post('saveDpTemplate')
    @ApiOperation({ summary: '保存' })
    saveDpTemplate(@Body() entity: DpTemplate) {
      if(!entity.id){
        entity.id = nanoid()
      }
      return this.dpTemplateService.save(entity);
    }
  
    @Post('saveDpTemplateBatch')
    @ApiOperation({ summary: '保存(批量)' })
    saveDpTemplateBatch(@Body() entity: DpTemplate[]) {
      entity.forEach(entityItem=>{
        if(!entityItem.id){
          entityItem.id = nanoid()
        }
      })
      return this.dpTemplateService.saveBatch(entity);
    }
  
    @Post('updateDpTemplate')
    @ApiOperation({ summary: '修改' })
    updateDpTemplate(@Body() entity: DpTemplate) {
      return this.dpTemplateService.update(entity);
    }
  
    @Post('updateDpTemplateBatch')
    @ApiOperation({ summary: '修改(批量)' })
    updateDpTemplateBatch(@Body() entity: DpTemplate[]) {
      return this.dpTemplateService.updateBatch(entity);
    }
  }
  