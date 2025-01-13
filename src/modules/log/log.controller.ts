import { Controller, Get, Post, Body, Query, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LogService } from './log.service';
import { Log } from './log.entity';
import { QueryLogDto, LogPaginatedResponseDto } from './dto/query-log.dto';

@ApiTags('日志管理')
@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('list')
  @ApiOperation({ summary: '查询所有日志列表（不分页）' })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    type: [Log]
  })
  async findList(@Query() query: Partial<QueryLogDto>) {
    return await this.logService.findList(query);
  }

  @Get()
  @ApiOperation({ summary: '分页查询日志' })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    type: LogPaginatedResponseDto
  })
  async findAll(@Query() query: QueryLogDto) {
    return await this.logService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取日志详情' })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    type: Log
  })
  async findOne(@Param('id') id: string) {
    return await this.logService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: '创建日志' })
  @ApiResponse({
    status: 201,
    description: '创建成功',
    type: Log
  })
  async create(@Body() log: Partial<Log>) {
    return await this.logService.create(log);
  }

  @Delete('batch')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '批量删除日志' })
  async deleteMany(@Body() ids: number[]) {
    await this.logService.deleteMany(ids);
  }

  @Delete('clear')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '清空所有日志' })
  async clearAll() {
    await this.logService.clearAll();
  }
} 