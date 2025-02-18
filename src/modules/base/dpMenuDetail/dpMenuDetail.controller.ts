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
  import { DpMenuDetailService } from './dpMenuDetail.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { DpMenuDetail } from './dpMenuDetail.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  
  @ApiTags('菜单详情接口')
  @Controller('/api/dpMenuDetail')
  export class DpMenuDetailController {
    constructor(private readonly dpMenuDetailService: DpMenuDetailService) {}
  
    @Post('deleteDpMenuDetail')
    @ApiOperation({ summary: '删除菜单详情' })
    deleteDpMenuDetail(@Query('id') id: string,@Req() req: Request) {
      return this.dpMenuDetailService.delete(id,req);
    }

    @Post('deleteDpMenuDetailBatch')
    @ApiOperation({ summary: '删除菜单详情(批量)' })
    deleteDpMenuDetailBatch(@Body() idList: string[],@Req() req: Request) {
      return this.dpMenuDetailService.deleteBatch(idList,req);
    }
  
    @Post('downloadDpMenuDetailTemplate')
    @ApiOperation({ summary: '导出菜单详情模板下载' })
    async downloadDpMenuDetailTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.dpMenuDetailService.downloadDpMenuDetailTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=菜单详情模板.xlsx');
      res.send(buffer);
    }
  
    @Post('getDpMenuDetail')
    @ApiOperation({ summary: '获取菜单详情' })
    getDpMenuDetail(@Query('id') id: string) {
      return this.dpMenuDetailService.getItem(id);
    }
  
    @Post('importDpMenuDetailByExcel')
    @ApiOperation({ summary: '导入菜单详情' })
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
    importDpMenuDetail(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.dpMenuDetailService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.dpMenuDetailService.exportByExcel(query);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMenuDetail.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.dpMenuDetailService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMenuDetail.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.dpMenuDetailService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMenuDetail.xml');
      res.send(xml);
    }
  
    @Post('insertDpMenuDetail')
    @ApiOperation({ summary: '增加菜单详情' })
    insertDpMenuDetail(@Body() entity: DpMenuDetail,@Req() req: Request) {
      return this.dpMenuDetailService.insert(entity,req);
    }
  
    @Post('insertDpMenuDetailBatch')
    @ApiOperation({ summary: '增加菜单详情(批量)' })
    insertDpMenuDetailBatch(@Body() entity: DpMenuDetail[],@Req() req: Request) {
      return this.dpMenuDetailService.insertBatch(entity,req);
    }
  
    @Post('queryDpMenuDetailDTOByCondition')
    @ApiOperation({ summary: '查询菜单详情列表结果' })
    queryDpMenuDetail(@Body() condition:QueryCondition) {
      return this.dpMenuDetailService.queryList(condition)
    }
  
    @Post('saveDpMenuDetail')
    @ApiOperation({ summary: '保存菜单详情' })
    saveDpMenuDetail(@Body() entity: DpMenuDetail,@Req() req: Request) {
      return this.dpMenuDetailService.save(entity,req);
    }
  
    @Post('saveDpMenuDetailBatch')
    @ApiOperation({ summary: '保存菜单详情(批量)' })
    saveDpMenuDetailBatch(@Body() entity: DpMenuDetail[],@Req() req: Request) {
      return this.dpMenuDetailService.saveBatch(entity,req); 
    }
  
    @Post('updateDpMenuDetail')
    @ApiOperation({ summary: '修改菜单详情' })
    updateDpMenuDetail(@Body() entity: DpMenuDetail,@Req() req: Request) {
      return this.dpMenuDetailService.update(entity,req);
    }
  
    @Post('updateDpMenuDetailBatch')
    @ApiOperation({ summary: '修改菜单详情(批量)' })
    updateDpMenuDetailBatch(@Body() entity: DpMenuDetail[],@Req() req: Request) {
        return this.dpMenuDetailService.updateBatch(entity,req);
    }
  }
  