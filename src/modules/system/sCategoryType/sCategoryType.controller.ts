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
  
  @ApiTags('分类类型接口')
  @Controller('/api/sCategoryType')
  export class SCategoryTypeController {
    constructor(private readonly sCategoryTypeService: SCategoryTypeService) {}
  
    @Post('deleteSCategoryType')
    @ApiOperation({ summary: '删除分类类型' })
    deleteSCategoryType(@Query('id') id: string,@Req() req: Request) {
      return this.sCategoryTypeService.delete(id,req);
    }

    @Post('deleteSCategoryTypeBatch')
    @ApiOperation({ summary: '删除分类类型(批量)' })
    deleteSCategoryTypeBatch(@Body() idList: string[],@Req() req: Request) {
      return this.sCategoryTypeService.deleteBatch(idList,req);
    }
  
    @Post('downloadSCategoryTypeTemplate')
    @ApiOperation({ summary: '导出分类类型模板下载' })
    async downloadSCategoryTypeTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.sCategoryTypeService.downloadSCategoryTypeTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=分类类型模板.xlsx');
      res.send(buffer);
    }
  
    @Post('getSCategoryType')
    @ApiOperation({ summary: '获取分类类型' })
    getSCategoryType(@Query('id') id: string) {
      return this.sCategoryTypeService.getItem(id);
    }
  
    @Post('importSCategoryTypeByExcel')
    @ApiOperation({ summary: '导入分类类型' })
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
      const buffer = await this.sCategoryTypeService.exportByExcel(query);
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
    @ApiOperation({ summary: '增加分类类型' })
    insertSCategoryType(@Body() entity: SCategoryType,@Req() req: Request) {
      return this.sCategoryTypeService.insert(entity,req);
    }
  
    @Post('insertSCategoryTypeBatch')
    @ApiOperation({ summary: '增加分类类型(批量)' })
    insertSCategoryTypeBatch(@Body() entity: SCategoryType[],@Req() req: Request) {
      return this.sCategoryTypeService.insertBatch(entity,req);
    }
  
    @Post('querySCategoryTypeDtoByCondition')
    @ApiOperation({ summary: '查询分类类型列表结果' })
    querySCategoryType(@Body() condition:QueryCondition) {
      return this.sCategoryTypeService.queryList(condition)
    }
  
    @Post('saveSCategoryType')
    @ApiOperation({ summary: '保存分类类型' })
    saveSCategoryType(@Body() entity: SCategoryType,@Req() req: Request) {
      return this.sCategoryTypeService.save(entity,req);
    }
  
    @Post('saveSCategoryTypeBatch')
    @ApiOperation({ summary: '保存分类类型(批量)' })
    saveSCategoryTypeBatch(@Body() entity: SCategoryType[],@Req() req: Request) {
      return this.sCategoryTypeService.saveBatch(entity,req); 
    }
  
    @Post('updateSCategoryType')
    @ApiOperation({ summary: '修改分类类型' })
    updateSCategoryType(@Body() entity: SCategoryType,@Req() req: Request) {
      return this.sCategoryTypeService.update(entity,req);
    }
  
    @Post('updateSCategoryTypeBatch')
    @ApiOperation({ summary: '修改分类类型(批量)' })
    updateSCategoryTypeBatch(@Body() entity: SCategoryType[],@Req() req: Request) {
        return this.sCategoryTypeService.updateBatch(entity,req);
    }
  }
  