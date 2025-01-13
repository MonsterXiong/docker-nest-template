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
  import { SCategoryService } from './sCategory.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { SCategory } from './sCategory.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  import { nanoid } from "nanoid";
  
  @ApiTags('分类接口')
  @Controller('/api/sCategory')
  export class SCategoryController {
    constructor(private readonly sCategoryService: SCategoryService) {}
  
    @Post('deleteSCategoryBatch')
    @ApiOperation({ summary: '删除分类(批量、递归)' })
    deleteSCategoryBatch(@Body() idList: string[]) {
      return this.sCategoryService.deleteBatch(idList);
    }
  
    @Post('downloadSCategoryTemplate')
    @ApiOperation({ summary: '导出分类模板下载' })
    async downloadSCategoryTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.sCategoryService.downloadSCategoryTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=category_template.xlsx');
      res.send(buffer);
    }
  
    @Post('getSCategory')
    @ApiOperation({ summary: '获取分类' })
    getSCategory(@Query('id') id: string) {
      return this.sCategoryService.getItem(id);
    }
  
    @Post('importSCategoryByExcel')
    @ApiOperation({ summary: '导入分类' })
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
    importSCategory(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.sCategoryService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.sCategoryService.exportByExcel(query,res);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=sCategory.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.sCategoryService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=sCategory.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.sCategoryService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=sCategory.xml');
      res.send(xml);
    }
  
    @Post('insertSCategory')
    @ApiOperation({ summary: '增加分类' })
    insertSCategory(@Body() entity: SCategory) {
      return this.sCategoryService.insert(entity);
    }
  
    @Post('insertSCategoryBatch')
    @ApiOperation({ summary: '增加分类(批量)' })
    insertSCategoryBatch(@Body() entity: SCategory[]) {
      return this.sCategoryService.insertBatch(entity);
    }
  
    @Post('querySCategory')
    @ApiOperation({ summary: '查询分类列表结果' })
    querySCategory(@Body() condition:QueryCondition) {
      return this.sCategoryService.queryList(condition)
    }
  
    @Post('saveSCategory')
    @ApiOperation({ summary: '保存分类' })
    saveSCategory(@Body() entity: SCategory) {
      if(!entity.id){
        entity.id = nanoid()
      }
      return this.sCategoryService.save(entity);
    }
  
    @Post('saveSCategoryBatch')
    @ApiOperation({ summary: '保存分类(批量)' })
    saveSCategoryBatch(@Body() entity: SCategory[]) {
      entity.forEach(entityItem=>{
        if(!entityItem.id){
          entityItem.id = nanoid()
        }
      })
      return this.sCategoryService.saveBatch(entity);
    }
  
    @Post('updateSCategory')
    @ApiOperation({ summary: '修改分类' })
    updateSCategory(@Body() entity: SCategory) {
      return this.sCategoryService.update(entity);
    }
  
    @Post('updateSCategoryBatch')
    @ApiOperation({ summary: '修改分类(批量)' })
    updateSCategoryBatch(@Body() entity: SCategory[]) {
      return this.sCategoryService.updateBatch(entity);
    }
  }
  