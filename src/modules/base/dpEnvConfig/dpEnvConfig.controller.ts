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
  import { DpEnvConfigService } from './dpEnvConfig.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { DpEnvConfig } from './dpEnvConfig.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  
  @ApiTags('环境变量配置接口')
  @Controller('/api/dpEnvConfig')
  export class DpEnvConfigController {
    constructor(private readonly dpEnvConfigService: DpEnvConfigService) {}
  
    @Post('deleteDpEnvConfig')
    @ApiOperation({ summary: '删除环境变量配置' })
    deleteDpEnvConfig(@Query('id') id: string,@Req() req: Request) {
      return this.dpEnvConfigService.delete(id,req);
    }

    @Post('deleteDpEnvConfigBatch')
    @ApiOperation({ summary: '删除环境变量配置(批量)' })
    deleteDpEnvConfigBatch(@Body() idList: string[],@Req() req: Request) {
      return this.dpEnvConfigService.deleteBatch(idList,req);
    }
  
    @Post('downloadDpEnvConfigTemplate')
    @ApiOperation({ summary: '导出环境变量配置模板下载' })
    async downloadDpEnvConfigTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.dpEnvConfigService.downloadDpEnvConfigTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=环境变量配置模板.xlsx');
      res.send(buffer);
    }
  
    @Post('getDpEnvConfig')
    @ApiOperation({ summary: '获取环境变量配置' })
    getDpEnvConfig(@Query('id') id: string) {
      return this.dpEnvConfigService.getItem(id);
    }
  
    @Post('importDpEnvConfigByExcel')
    @ApiOperation({ summary: '导入环境变量配置' })
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
    importDpEnvConfig(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.dpEnvConfigService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.dpEnvConfigService.exportByExcel(query);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=dpEnvConfig.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.dpEnvConfigService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=dpEnvConfig.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.dpEnvConfigService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=dpEnvConfig.xml');
      res.send(xml);
    }
  
    @Post('insertDpEnvConfig')
    @ApiOperation({ summary: '增加环境变量配置' })
    insertDpEnvConfig(@Body() entity: DpEnvConfig,@Req() req: Request) {
      return this.dpEnvConfigService.insert(entity,req);
    }
  
    @Post('insertDpEnvConfigBatch')
    @ApiOperation({ summary: '增加环境变量配置(批量)' })
    insertDpEnvConfigBatch(@Body() entity: DpEnvConfig[],@Req() req: Request) {
      return this.dpEnvConfigService.insertBatch(entity,req);
    }
  
    @Post('queryDpEnvConfigDtoByCondition')
    @ApiOperation({ summary: '查询环境变量配置列表结果' })
    queryDpEnvConfig(@Body() condition:QueryCondition) {
      return this.dpEnvConfigService.queryList(condition)
    }
  
    @Post('saveDpEnvConfig')
    @ApiOperation({ summary: '保存环境变量配置' })
    saveDpEnvConfig(@Body() entity: DpEnvConfig,@Req() req: Request) {
      return this.dpEnvConfigService.save(entity,req);
    }
  
    @Post('saveDpEnvConfigBatch')
    @ApiOperation({ summary: '保存环境变量配置(批量)' })
    saveDpEnvConfigBatch(@Body() entity: DpEnvConfig[],@Req() req: Request) {
      return this.dpEnvConfigService.saveBatch(entity,req); 
    }
  
    @Post('updateDpEnvConfig')
    @ApiOperation({ summary: '修改环境变量配置' })
    updateDpEnvConfig(@Body() entity: DpEnvConfig,@Req() req: Request) {
      return this.dpEnvConfigService.update(entity,req);
    }
  
    @Post('updateDpEnvConfigBatch')
    @ApiOperation({ summary: '修改环境变量配置(批量)' })
    updateDpEnvConfigBatch(@Body() entity: DpEnvConfig[],@Req() req: Request) {
        return this.dpEnvConfigService.updateBatch(entity,req);
    }
  }
  