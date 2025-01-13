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
  import { SCategoryTypeService } from './sCategoryType.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { SCategoryType } from './sCategoryType.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  import { nanoid } from "nanoid";
  
  @ApiTags('接口')
  @Controller('/api/sCategoryType')
  export class SCategoryTypeController {
    constructor(private readonly sCategoryTypeService: SCategoryTypeService) {}
  
    @Post('deleteSCategoryTypeBatch')
    @ApiOperation({ summary: '删除(批量、递归)' })
    deleteSCategoryTypeBatch(@Body() idList: string[]) {
      return this.sCategoryTypeService.deleteBatch(idList);
    }
  
    @Post('downloadSCategoryTypeTemplate')
    @ApiOperation({ summary: '导出模板下载' })
    async downloadSCategoryTypeTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.sCategoryTypeService.downloadSCategoryTypeTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=category_template.xlsx');
      res.send(buffer);
    }
  
    @Post('getSCategoryType')
    @ApiOperation({ summary: '获取' })
    getSCategoryType(@Query('id') id: string) {
      return this.sCategoryTypeService.getItem(id);
    }
  
    @Post('importSCategoryTypeByExcel')
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
    importSCategoryType(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.sCategoryTypeService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.sCategoryTypeService.exportByExcel(query,res);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=sCategoryType.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.sCategoryTypeService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=sCategoryType.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.sCategoryTypeService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=sCategoryType.xml');
      res.send(xml);
    }
  
    @Post('insertSCategoryType')
    @ApiOperation({ summary: '增加' })
    insertSCategoryType(@Body() entity: SCategoryType) {
      return this.sCategoryTypeService.insert(entity);
    }
  
    @Post('insertSCategoryTypeBatch')
    @ApiOperation({ summary: '增加(批量)' })
    insertSCategoryTypeBatch(@Body() entity: SCategoryType[]) {
      return this.sCategoryTypeService.insertBatch(entity);
    }
  
    @Post('querySCategoryType')
    @ApiOperation({ summary: '查询列表结果' })
    querySCategoryType(@Body() condition:QueryCondition) {
      return this.sCategoryTypeService.queryList(condition)
    }
  
    @Post('saveSCategoryType')
    @ApiOperation({ summary: '保存' })
    saveSCategoryType(@Body() entity: SCategoryType) {
      if(!entity.id){
        entity.id = nanoid()
      }
      return this.sCategoryTypeService.save(entity);
    }
  
    @Post('saveSCategoryTypeBatch')
    @ApiOperation({ summary: '保存(批量)' })
    saveSCategoryTypeBatch(@Body() entity: SCategoryType[]) {
      entity.forEach(entityItem=>{
        if(!entityItem.id){
          entityItem.id = nanoid()
        }
      })
      return this.sCategoryTypeService.saveBatch(entity);
    }
  
    @Post('updateSCategoryType')
    @ApiOperation({ summary: '修改' })
    updateSCategoryType(@Body() entity: SCategoryType) {
      return this.sCategoryTypeService.update(entity);
    }
  
    @Post('updateSCategoryTypeBatch')
    @ApiOperation({ summary: '修改(批量)' })
    updateSCategoryTypeBatch(@Body() entity: SCategoryType[]) {
      return this.sCategoryTypeService.updateBatch(entity);
    }
  }
  