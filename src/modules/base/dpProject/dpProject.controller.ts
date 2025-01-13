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
  import { DpProjectService } from './dpProject.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { DpProject } from './dpProject.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  import { nanoid } from "nanoid";
  
  @ApiTags('项目接口')
  @Controller('/api/dpProject')
  export class DpProjectController {
    constructor(private readonly dpProjectService: DpProjectService) {}
  
    @Post('deleteDpProjectBatch')
    @ApiOperation({ summary: '删除项目(批量、递归)' })
    deleteDpProjectBatch(@Body() idList: string[]) {
      return this.dpProjectService.deleteBatch(idList);
    }
  
    @Post('downloadDpProjectTemplate')
    @ApiOperation({ summary: '导出项目模板下载' })
    async downloadDpProjectTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.dpProjectService.downloadDpProjectTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=category_template.xlsx');
      res.send(buffer);
    }
  
    @Post('getDpProject')
    @ApiOperation({ summary: '获取项目' })
    getDpProject(@Query('id') id: string) {
      return this.dpProjectService.getItem(id);
    }
  
    @Post('importDpProjectByExcel')
    @ApiOperation({ summary: '导入项目' })
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
    importDpProject(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.dpProjectService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.dpProjectService.exportByExcel(query,res);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=dpProject.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.dpProjectService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=dpProject.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.dpProjectService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=dpProject.xml');
      res.send(xml);
    }
  
    @Post('insertDpProject')
    @ApiOperation({ summary: '增加项目' })
    insertDpProject(@Body() entity: DpProject) {
      return this.dpProjectService.insert(entity);
    }
  
    @Post('insertDpProjectBatch')
    @ApiOperation({ summary: '增加项目(批量)' })
    insertDpProjectBatch(@Body() entity: DpProject[]) {
      return this.dpProjectService.insertBatch(entity);
    }
  
    @Post('queryDpProject')
    @ApiOperation({ summary: '查询项目列表结果' })
    queryDpProject(@Body() condition:QueryCondition) {
      return this.dpProjectService.queryList(condition)
    }
  
    @Post('saveDpProject')
    @ApiOperation({ summary: '保存项目' })
    saveDpProject(@Body() entity: DpProject) {
      if(!entity.id){
        entity.id = nanoid()
      }
      return this.dpProjectService.save(entity);
    }
  
    @Post('saveDpProjectBatch')
    @ApiOperation({ summary: '保存项目(批量)' })
    saveDpProjectBatch(@Body() entity: DpProject[]) {
      entity.forEach(entityItem=>{
        if(!entityItem.id){
          entityItem.id = nanoid()
        }
      })
      return this.dpProjectService.saveBatch(entity);
    }
  
    @Post('updateDpProject')
    @ApiOperation({ summary: '修改项目' })
    updateDpProject(@Body() entity: DpProject) {
      return this.dpProjectService.update(entity);
    }
  
    @Post('updateDpProjectBatch')
    @ApiOperation({ summary: '修改项目(批量)' })
    updateDpProjectBatch(@Body() entity: DpProject[]) {
      return this.dpProjectService.updateBatch(entity);
    }
  }
  