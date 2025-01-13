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
  import { NavService } from './nav.service';
  import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { Nav } from './nav.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { QueryCondition } from 'src/interfaces/queryCondition.interface';
  import { nanoid } from "nanoid";
  
  @ApiTags('导航接口')
  @Controller('/api/nav')
  export class NavController {
    constructor(private readonly navService: NavService) {}
  
    @Post('deleteNavBatch')
    @ApiOperation({ summary: '删除导航(批量、递归)' })
    deleteNavBatch(@Body() idList: string[]) {
      return this.navService.deleteBatch(idList);
    }
  
    @Post('downloadNavTemplate')
    @ApiOperation({ summary: '导出导航模板下载' })
    async downloadNavTemplate(@Res() res: Response): Promise<void> {
      const buffer = this.navService.downloadNavTemplate();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=category_template.xlsx');
      res.send(buffer);
    }
  
    @Post('getNav')
    @ApiOperation({ summary: '获取导航' })
    getNav(@Query('id') id: string) {
      return this.navService.getItem(id);
    }
  
    @Post('importNavByExcel')
    @ApiOperation({ summary: '导入导航' })
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
    importNav(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
      if (!file) {
        throw new Error('请选择要导入的文件');
      }
      return this.navService.importFromExcel(file.buffer, req);
    }
  
    @Post('exportByExcel')
    @ApiOperation({ summary: '导出Excel' })
    async exportByExcel(@Body() query: QueryCondition, @Res() res: Response) {
      const buffer = await this.navService.exportByExcel(query,res);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=nav.xlsx');
      res.send(buffer);
    }
  
    @Post('exportByJson')
    @ApiOperation({ summary: '导出JSON' })
    async exportByJson(@Body() query: QueryCondition, @Res() res: Response) {
      const json = await this.navService.exportByJson(query);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=nav.json');
      res.send(json);
    }
  
    @Post('exportByXml')
    @ApiOperation({ summary: '导出XML' })
    async exportByXml(@Body() query: QueryCondition, @Res() res: Response) {
      const xml = await this.navService.exportByXml(query);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename=nav.xml');
      res.send(xml);
    }
  
    @Post('insertNav')
    @ApiOperation({ summary: '增加导航' })
    insertNav(@Body() entity: Nav) {
      return this.navService.insert(entity);
    }
  
    @Post('insertNavBatch')
    @ApiOperation({ summary: '增加导航(批量)' })
    insertNavBatch(@Body() entity: Nav[]) {
      return this.navService.insertBatch(entity);
    }
  
    @Post('queryNav')
    @ApiOperation({ summary: '查询导航列表结果' })
    queryNav(@Body() condition:QueryCondition) {
      return this.navService.queryList(condition)
    }
  
    @Post('saveNav')
    @ApiOperation({ summary: '保存导航' })
    saveNav(@Body() entity: Nav) {
      if(!entity.id){
        entity.id = nanoid()
      }
      return this.navService.save(entity);
    }
  
    @Post('saveNavBatch')
    @ApiOperation({ summary: '保存导航(批量)' })
    saveNavBatch(@Body() entity: Nav[]) {
      entity.forEach(entityItem=>{
        if(!entityItem.id){
          entityItem.id = nanoid()
        }
      })
      return this.navService.saveBatch(entity);
    }
  
    @Post('updateNav')
    @ApiOperation({ summary: '修改导航' })
    updateNav(@Body() entity: Nav) {
      return this.navService.update(entity);
    }
  
    @Post('updateNavBatch')
    @ApiOperation({ summary: '修改导航(批量)' })
    updateNavBatch(@Body() entity: Nav[]) {
      return this.navService.updateBatch(entity);
    }
  }
  