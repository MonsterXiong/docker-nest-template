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
  
  @ApiTags('项目信息接口')
  @Controller('/api/dpProjectInfo')
  export class DpProjectInfoController {
    constructor(private readonly dpProjectInfoService: DpProjectInfoService) {}
  
    @Post('deleteDpProjectInfo')
    @ApiOperation({ summary: '删除项目信息' })
    deleteDpProjectInfo(@Query('id') id: string,@Req() req: Request) {
      return this.dpProjectInfoService.delete(id,req);
    }

    @Post('deleteDpProjectInfoBatch')
    @ApiOperation({ summary: '删除项目信息(批量)' })
    deleteDpProjectInfoBatch(@Body() idList: string[],@Req() req: Request) {
      return this.dpProjectInfoService.deleteBatch(idList,req);
    }
  
    @Post('downloadDpProjectInfoTemplate')
    @ApiOperation({ summary: '导出项目信息模板下载' })
    async downloadDpProjectInfoTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.dpProjectInfoService.downloadDpProjectInfoTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=项目信息模板.xlsx');
      res.send(buffer);
    }
  
    @Post('getDpProjectInfo')
    @ApiOperation({ summary: '获取项目信息' })
    getDpProjectInfo(@Query('id') id: string) {
      return this.dpProjectInfoService.getItem(id);
    }
  
    @Post('importDpProjectInfoByExcel')
    @ApiOperation({ summary: '导入项目信息' })
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
      const buffer = await this.dpProjectInfoService.exportByExcel(query);
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
    @ApiOperation({ summary: '增加项目信息' })
    insertDpProjectInfo(@Body() entity: DpProjectInfo,@Req() req: Request) {
      return this.dpProjectInfoService.insert(entity,req);
    }
  
    @Post('insertDpProjectInfoBatch')
    @ApiOperation({ summary: '增加项目信息(批量)' })
    insertDpProjectInfoBatch(@Body() entity: DpProjectInfo[],@Req() req: Request) {
      return this.dpProjectInfoService.insertBatch(entity,req);
    }
  
    @Post('queryDpProjectInfoDtoByCondition')
    @ApiOperation({ summary: '查询项目信息列表结果' })
    queryDpProjectInfo(@Body() condition:QueryCondition) {
      return this.dpProjectInfoService.queryList(condition)
    }
  
    @Post('saveDpProjectInfo')
    @ApiOperation({ summary: '保存项目信息' })
    saveDpProjectInfo(@Body() entity: DpProjectInfo,@Req() req: Request) {
      return this.dpProjectInfoService.save(entity,req);
    }
  
    @Post('saveDpProjectInfoBatch')
    @ApiOperation({ summary: '保存项目信息(批量)' })
    saveDpProjectInfoBatch(@Body() entity: DpProjectInfo[],@Req() req: Request) {
      return this.dpProjectInfoService.saveBatch(entity,req); 
    }
  
    @Post('updateDpProjectInfo')
    @ApiOperation({ summary: '修改项目信息' })
    updateDpProjectInfo(@Body() entity: DpProjectInfo,@Req() req: Request) {
      return this.dpProjectInfoService.update(entity,req);
    }
  
    @Post('updateDpProjectInfoBatch')
    @ApiOperation({ summary: '修改项目信息(批量)' })
    updateDpProjectInfoBatch(@Body() entity: DpProjectInfo[],@Req() req: Request) {
        return this.dpProjectInfoService.updateBatch(entity,req);
    }
  }
  