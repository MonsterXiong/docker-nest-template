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
}
