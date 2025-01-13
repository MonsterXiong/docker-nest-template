import { Controller, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DbService } from './db.service';
import { 
  DatabaseConfigDto, 
  TableSchemaDto, 
  BatchTablesDto
} from '../../../shared/dto/database.dto';
import { ConnectionTestResultDto } from './db.dto';

@ApiTags('数据库管理')
@Controller('db')
export class DbController {
  constructor(private readonly dbService: DbService) {}

  @Post('test-connection')
  @ApiOperation({
    summary: '测试数据库连接',
    description: '测试提供的数据库配置是否可以成功连接'
  })
  @ApiBody({
    type: DatabaseConfigDto,
    description: '数据库连接配置',
  })
  @ApiResponse({
    status: 200,
    description: '连接测试结果',
    type: ConnectionTestResultDto
  })
  async testConnection(@Body() config: DatabaseConfigDto): Promise<ConnectionTestResultDto> {
    try {
      await this.validateDatabaseConfig(config);
      const connection = await this.dbService['getConnection'](config);
      await connection.release();
      return { success: true, message: '连接成功' };
    } catch (error) {
      return { 
        success: false, 
        message: '连接失败', 
        error: error instanceof Error ? error.message : '未知错误' 
      };
    }
  }

  @Post('tables/all')
  @ApiOperation({
    summary: '获取所有表信息',
    description: '获取指定数据库中所有表的结构信息'
  })
  @ApiBody({
    type: DatabaseConfigDto,
    description: '数据库连接配置',
  })
  @ApiResponse({
    status: 200,
    description: '数据库中所有表的结构信息',
    type: [TableSchemaDto]
  })
  async getDatabaseSchema(@Body() config: DatabaseConfigDto): Promise<TableSchemaDto[]> {
    try {
      await this.validateDatabaseConfig(config);
      return await this.dbService.getTableList(config);
    } catch (error) {
      throw new HttpException(
        `获取数据库表结构失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('tables/:tableName/columns')
  @ApiOperation({
    summary: '获取指定表的列信息',
    description: '获取指定表的详细结构信息'
  })
  @ApiParam({
    name: 'tableName',
    description: '表名',
    type: 'string',
    example: 'log'
  })
  @ApiBody({
    type: DatabaseConfigDto,
    description: '数据库连接配置',
  })
  @ApiResponse({
    status: 200,
    description: '表的详细结构信息',
    type: TableSchemaDto
  })
  async getTableColumns(
    @Body() config: DatabaseConfigDto,
    @Param('tableName') tableName: string
  ): Promise<TableSchemaDto> {
    try {
      await this.validateDatabaseConfig(config);
      return await this.dbService.getTable(config, tableName);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `获取表结构失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('tables/batch')
  @ApiOperation({
    summary: '批量获取指定表的信息',
    description: '批量获取多个表的结构信息'
  })
  @ApiBody({
    type: BatchTablesDto,
    description: '批量查询配置',
  })
  @ApiResponse({
    status: 200,
    description: '表结构信息列表',
    type: [TableSchemaDto]
  })
  async getTableColumnsMultiple(@Body() data: BatchTablesDto): Promise<TableSchemaDto[]> {
    try {
      await this.validateDatabaseConfig(data.config);
      if (!Array.isArray(data.tableNames) || data.tableNames.length === 0) {
        throw new HttpException(
          '表名列表不能为空',
          HttpStatus.BAD_REQUEST
        );
      }
      return await this.dbService.getTableColumnsMultiple(
        data.config,
        data.tableNames
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `批量获取表结构失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async validateDatabaseConfig(config: DatabaseConfigDto): Promise<void> {
    if (!config.host || !config.port || !config.user || !config.database) {
      throw new HttpException(
        '数据库配置信息不完整',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
