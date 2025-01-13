import { Controller, Get, Post, Body } from '@nestjs/common';
import { NavExtendService } from './navExtend.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('导航扩展')
@Controller('nav/extend')
export class NavExtendController {
  constructor(private readonly navExtendService: NavExtendService) {}

  @Post('getNavData')
  @ApiOperation({ summary: '获取首页导航数据' })
  async getNavData(): Promise<any> {
    return await this.navExtendService.getNavData();
  }

  @Post('batch-create')
  @ApiOperation({ summary: '批量创建导航树结构' })
  @ApiBody({ type: Object })
  @ApiResponse({ 
    status: 201,
    description: '导航树创建成功',
  })
  @ApiResponse({ 
    status: 400,
    description: '无效的输入数据',
  })
  @ApiResponse({ 
    status: 500,
    description: '服务器内部错误',
  })
  async batchCreateNavTree(@Body() navTree) {
    return this.navExtendService.batchCreateNavTree(navTree);
  }
}
