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
  import { DpTemplatePromptService } from './dpTemplatePrompt.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { DpTemplatePrompt } from './dpTemplatePrompt.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  
  @ApiTags('模板提示接口')
  @Controller('/api/dpTemplatePrompt')
  export class DpTemplatePromptController {
    constructor(private readonly dpTemplatePromptService: DpTemplatePromptService) {}
  
    @Post('deleteDpTemplatePrompt')
    @ApiOperation({ summary: '删除模板提示' })
    deleteDpTemplatePrompt(@Query('id') id: string,@Req() req: Request) {
      return this.dpTemplatePromptService.delete(id,req);
    }

    @Post('deleteDpTemplatePromptBatch')
    @ApiOperation({ summary: '删除模板提示(批量)' })
    deleteDpTemplatePromptBatch(@Body() idList: string[],@Req() req: Request) {
      return this.dpTemplatePromptService.deleteBatch(idList,req);
    }
  
    @Post('downloadDpTemplatePromptTemplate')
    @ApiOperation({ summary: '导出模板提示模板下载' })
    async downloadDpTemplatePromptTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.dpTemplatePromptService.downloadDpTemplatePromptTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=模板提示模板.xlsx');
      res.send(buffer);
    }
  
    @Post('getDpTemplatePrompt')
    @ApiOperation({ summary: '获取模板提示' })
    getDpTemplatePrompt(@Query('id') id: string) {
      return this.dpTemplatePromptService.getItem(id);
    }
  
    @Post('importDpTemplatePromptByExcel')
    @ApiOperation({ summary: '导入模板提示' })
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
    importDpTemplatePrompt(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.dpTemplatePromptService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.dpTemplatePromptService.exportByExcel(query);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=dpTemplatePrompt.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.dpTemplatePromptService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=dpTemplatePrompt.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.dpTemplatePromptService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=dpTemplatePrompt.xml');
      res.send(xml);
    }
  
    @Post('insertDpTemplatePrompt')
    @ApiOperation({ summary: '增加模板提示' })
    insertDpTemplatePrompt(@Body() entity: DpTemplatePrompt,@Req() req: Request) {
      return this.dpTemplatePromptService.insert(entity,req);
    }
  
    @Post('insertDpTemplatePromptBatch')
    @ApiOperation({ summary: '增加模板提示(批量)' })
    insertDpTemplatePromptBatch(@Body() entity: DpTemplatePrompt[],@Req() req: Request) {
      return this.dpTemplatePromptService.insertBatch(entity,req);
    }
  
    @Post('queryDpTemplatePromptDTOByCondition')
    @ApiOperation({ summary: '查询模板提示列表结果' })
    queryDpTemplatePrompt(@Body() condition:QueryCondition) {
      return this.dpTemplatePromptService.queryList(condition)
    }
  
    @Post('saveDpTemplatePrompt')
    @ApiOperation({ summary: '保存模板提示' })
    saveDpTemplatePrompt(@Body() entity: DpTemplatePrompt,@Req() req: Request) {
      return this.dpTemplatePromptService.save(entity,req);
    }
  
    @Post('saveDpTemplatePromptBatch')
    @ApiOperation({ summary: '保存模板提示(批量)' })
    saveDpTemplatePromptBatch(@Body() entity: DpTemplatePrompt[],@Req() req: Request) {
      return this.dpTemplatePromptService.saveBatch(entity,req); 
    }
  
    @Post('updateDpTemplatePrompt')
    @ApiOperation({ summary: '修改模板提示' })
    updateDpTemplatePrompt(@Body() entity: DpTemplatePrompt,@Req() req: Request) {
      return this.dpTemplatePromptService.update(entity,req);
    }
  
    @Post('updateDpTemplatePromptBatch')
    @ApiOperation({ summary: '修改模板提示(批量)' })
    updateDpTemplatePromptBatch(@Body() entity: DpTemplatePrompt[],@Req() req: Request) {
        return this.dpTemplatePromptService.updateBatch(entity,req);
    }
  }
  