import { Controller, Post, Body } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseConfigDto, TableConfig } from './dto/databaseConfig.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @ApiBody({
    description: '数据库连接配置',
  })
  @Post('generate')
  async generateTables(
    @Body() data: { config: DatabaseConfigDto; tables: TableConfig[] }
  ) {
    await this.databaseService.generateTables(data.config, data.tables);
    return { message: 'Tables generated successfully' };
  }

  @ApiOperation({ summary: '比较数据库表结构差异' })
  @ApiBody({
    description: '数据库配置和目标表结构',
    type: Object
  })
  @Post('compare')
  async compareTables(
    @Body() data: { config: DatabaseConfigDto; tables: TableConfig[] }
  ) {
    const differences = await this.databaseService.compareTables(data.config, data.tables);
    return { differences };
  }
}
