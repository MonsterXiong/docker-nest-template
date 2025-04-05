import { Body, Controller, Post, Query, Req, Res } from '@nestjs/common';
import { DpMenuExtendService } from './dpMenuExtend.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { QueryCondition } from 'src/interfaces/queryCondition.interface';
import { DpmenuExtendDto } from './dpMenuExtend.dto';
import { GenEnum } from 'src/enums/gen.enum';

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

  @Post('queryDpMenuExtendDTOByCondition')
  @ApiOperation({ summary: '查询菜单及菜单详情' })
  queryDpEnvConfig(@Body() condition:QueryCondition) {
    return this.dpMenuExtendService.queryList(condition)
  }

  @Post('getDpMenuExtend')
  @ApiOperation({ summary: '获取菜单及菜单详情' })
  getDpMenuExtend(@Query('id') id: string) {
    return this.dpMenuExtendService.findOne(id);
  }

  @Post('insertDpMenuExtend')
  @ApiOperation({ summary: '新增菜单及菜单详情' })
  insertDpMenuExtend(@Body() entity: DpmenuExtendDto,@Req() req: Request) {
    return this.dpMenuExtendService.insert(entity,req);
  }

  @Post('cleanMenu')
  @ApiOperation({ summary: '清洗菜单' })
  cleanMenu(@Req() req: Request) {
    return this.dpMenuExtendService.cleanMenu(req);
  }

  @Post('getServiceById')
  @ApiOperation({ summary: '获取service通过菜单Id' })
  @ApiQuery({
    name: 'id',
    required: true,
  })
  getServiceById(@Query('id') id: string, @Res() res: Response) {
    return this.dpMenuExtendService.getServiceById(id,GenEnum.NO_GEN,res);
  }

  @Post('genServiceById')
  @ApiOperation({ summary: '生成service通过菜单Id' })
  @ApiQuery({
    name: 'id',
    required: true,
  })
  genServiceById(@Query('id') id: string,@Res() res: Response) {
    return this.dpMenuExtendService.getServiceById(id,GenEnum.GEN,res);
  }
}
