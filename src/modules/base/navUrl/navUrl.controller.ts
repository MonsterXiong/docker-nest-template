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
  import { NavUrlService } from './navUrl.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { NavUrl } from './navUrl.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  import { nanoid } from "nanoid";
  
  @ApiTags('导航链接接口')
  @Controller('/api/navUrl')
  export class NavUrlController {
    constructor(private readonly navUrlService: NavUrlService) {}
  
    @Post('deleteNavUrlBatch')
    @ApiOperation({ summary: '删除导航链接(批量、递归)' })
    deleteNavUrlBatch(@Body() idList: string[]) {
      return this.navUrlService.deleteBatch(idList);
    }
  
    @Post('downloadNavUrlTemplate')
    @ApiOperation({ summary: '导出导航链接模板下载' })
    async downloadNavUrlTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.navUrlService.downloadNavUrlTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=category_template.xlsx');
      res.send(buffer);
    }
  
    @Post('getNavUrl')
    @ApiOperation({ summary: '获取导航链接' })
    getNavUrl(@Query('id') id: string) {
      return this.navUrlService.getItem(id);
    }
  
    @Post('importNavUrlByExcel')
    @ApiOperation({ summary: '导入导航链接' })
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
    importNavUrl(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.navUrlService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.navUrlService.exportByExcel(query,res);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=navUrl.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.navUrlService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=navUrl.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.navUrlService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=navUrl.xml');
      res.send(xml);
    }
  
    @Post('insertNavUrl')
    @ApiOperation({ summary: '增加导航链接' })
    insertNavUrl(@Body() entity: NavUrl) {
      return this.navUrlService.insert(entity);
    }
  
    @Post('insertNavUrlBatch')
    @ApiOperation({ summary: '增加导航链接(批量)' })
    insertNavUrlBatch(@Body() entity: NavUrl[]) {
      return this.navUrlService.insertBatch(entity);
    }
  
    @Post('queryNavUrl')
    @ApiOperation({ summary: '查询导航链接列表结果' })
    queryNavUrl(@Body() condition:QueryCondition) {
      return this.navUrlService.queryList(condition)
    }
  
    @Post('saveNavUrl')
    @ApiOperation({ summary: '保存导航链接' })
    saveNavUrl(@Body() entity: NavUrl) {
      if(!entity.id){
        entity.id = nanoid()
      }
      return this.navUrlService.save(entity);
    }
  
    @Post('saveNavUrlBatch')
    @ApiOperation({ summary: '保存导航链接(批量)' })
    saveNavUrlBatch(@Body() entity: NavUrl[]) {
      entity.forEach(entityItem=>{
        if(!entityItem.id){
          entityItem.id = nanoid()
        }
      })
      return this.navUrlService.saveBatch(entity);
    }
  
    @Post('updateNavUrl')
    @ApiOperation({ summary: '修改导航链接' })
    updateNavUrl(@Body() entity: NavUrl) {
      return this.navUrlService.update(entity);
    }
  
    @Post('updateNavUrlBatch')
    @ApiOperation({ summary: '修改导航链接(批量)' })
    updateNavUrlBatch(@Body() entity: NavUrl[]) {
      return this.navUrlService.updateBatch(entity);
    }
  }
  