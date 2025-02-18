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
  import { DpMenuService } from './dpMenu.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { DpMenu } from './dpMenu.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  
  @ApiTags('菜单接口')
  @Controller('/api/dpMenu')
  export class DpMenuController {
    constructor(private readonly dpMenuService: DpMenuService) {}
  
    @Post('deleteDpMenu')
    @ApiOperation({ summary: '删除菜单' })
    deleteDpMenu(@Query('id') id: string,@Req() req: Request) {
      return this.dpMenuService.delete(id,req);
    }

    @Post('deleteDpMenuBatch')
    @ApiOperation({ summary: '删除菜单(批量)' })
    deleteDpMenuBatch(@Body() idList: string[],@Req() req: Request) {
      return this.dpMenuService.deleteBatch(idList,req);
    }
  
    @Post('downloadDpMenuTemplate')
    @ApiOperation({ summary: '导出菜单模板下载' })
    async downloadDpMenuTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.dpMenuService.downloadDpMenuTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=菜单模板.xlsx');
      res.send(buffer);
    }
  
    @Post('getDpMenu')
    @ApiOperation({ summary: '获取菜单' })
    getDpMenu(@Query('id') id: string) {
      return this.dpMenuService.getItem(id);
    }
  
    @Post('importDpMenuByExcel')
    @ApiOperation({ summary: '导入菜单' })
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
    importDpMenu(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.dpMenuService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.dpMenuService.exportByExcel(query);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMenu.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.dpMenuService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMenu.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.dpMenuService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=dpMenu.xml');
      res.send(xml);
    }
  
    @Post('insertDpMenu')
    @ApiOperation({ summary: '增加菜单' })
    insertDpMenu(@Body() entity: DpMenu,@Req() req: Request) {
      return this.dpMenuService.insert(entity,req);
    }
  
    @Post('insertDpMenuBatch')
    @ApiOperation({ summary: '增加菜单(批量)' })
    insertDpMenuBatch(@Body() entity: DpMenu[],@Req() req: Request) {
      return this.dpMenuService.insertBatch(entity,req);
    }
  
    @Post('queryDpMenuDTOByCondition')
    @ApiOperation({ summary: '查询菜单列表结果' })
    queryDpMenu(@Body() condition:QueryCondition) {
      return this.dpMenuService.queryList(condition)
    }
  
    @Post('saveDpMenu')
    @ApiOperation({ summary: '保存菜单' })
    saveDpMenu(@Body() entity: DpMenu,@Req() req: Request) {
      return this.dpMenuService.save(entity,req);
    }
  
    @Post('saveDpMenuBatch')
    @ApiOperation({ summary: '保存菜单(批量)' })
    saveDpMenuBatch(@Body() entity: DpMenu[],@Req() req: Request) {
      return this.dpMenuService.saveBatch(entity,req); 
    }
  
    @Post('updateDpMenu')
    @ApiOperation({ summary: '修改菜单' })
    updateDpMenu(@Body() entity: DpMenu,@Req() req: Request) {
      return this.dpMenuService.update(entity,req);
    }
  
    @Post('updateDpMenuBatch')
    @ApiOperation({ summary: '修改菜单(批量)' })
    updateDpMenuBatch(@Body() entity: DpMenu[],@Req() req: Request) {
        return this.dpMenuService.updateBatch(entity,req);
    }
  }
  