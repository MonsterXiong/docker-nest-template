import { Body, Controller, Post, Query, Req } from '@nestjs/common';
import { DpMenuExtendService } from './dpMenuExtend.service';
import { ApiOperation } from '@nestjs/swagger';
import { QueryCondition } from 'src/interfaces/queryCondition.interface';
import { DpmenuExtendDto } from './dpMenuExtend.dto';

@Controller('dpMenuExtend')
export class DpMenuExtendController {
  constructor(private readonly dpMenuExtendService: DpMenuExtendService) {}


  @Post('deleteDpMenuExtend')
  @ApiOperation({ summary: '删除菜单及菜单详情' })
  deleteDpEnvConfig(@Query('id') id: string,@Req() req: Request) {
    return this.dpMenuExtendService.delete(id,req);
  }

  @Post('deleteDpMenuExtendBatch')
  @ApiOperation({ summary: '删除菜单及菜单详情(批量)' })
  deleteDpMenuExtendBatch(@Body() idList: string[],@Req() req: Request) {
    return this.dpMenuExtendService.deleteBatch(idList,req);
  }

  @Post('queryMenuExtendDTOByCondition')
  @ApiOperation({ summary: '查询菜单及菜单详情' })
  queryDpEnvConfig(@Body() condition:QueryCondition) {
    return this.dpMenuExtendService.queryList(condition)
  }

  @Post('getDpMenuExtend')
  @ApiOperation({ summary: '获取菜单及菜单详情' })
  getDpMenuExtend(@Query('id') id: string) {
    return this.dpMenuExtendService.findOne(id);
  }

  @Post('insertDpEnvConfig')
  @ApiOperation({ summary: '新增菜单及菜单详情' })
  insertDpEnvConfig(@Body() entity: DpmenuExtendDto,@Req() req: Request) {
    return this.dpMenuExtendService.insert(entity,req);
  }



}
