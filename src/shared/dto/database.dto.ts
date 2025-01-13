import { IsString, IsNumber, IsOptional, IsNotEmpty, IsArray } from 'class-validator';
import { ApiBody, ApiProperty } from '@nestjs/swagger';

export class DatabaseConfigDto {
  @ApiProperty({ 
    description: '数据库主机地址',
    example: 'localhost'
  })
  @IsString()
  @IsNotEmpty()
  host: string;

  @ApiProperty({ 
    description: '数据库端口',
    example: 3306
  })
  @IsNumber()
  @IsNotEmpty()
  port: number;

  @ApiProperty({ 
    description: '数据库用户名',
    example: 'root'
  })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({ 
    description: '数据库密码',
    example: '123456'
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ 
    description: '数据库名称',
    example: 'development_platform'
  })
  @IsString()
  @IsNotEmpty()
  database: string;

  @ApiProperty({ 
    description: '数据库类型', 
    example: 'mysql',
    default: 'mysql'
  })
  @IsString()
  @IsOptional()
  type: string = 'mysql';
}

export class BatchTablesDto {
  @ApiProperty({
    description: '数据库配置信息',
    type: DatabaseConfigDto
  })
  @IsNotEmpty()
  config: DatabaseConfigDto;

  @ApiProperty({
    description: '要查询的表名列表',
    type: [String],
    example: ['log', 'dp_menu']
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tableNames: string[];
}

export class ColumnSchemaDto {
  @ApiProperty({ description: '字段名' })
  Field: string;

  @ApiProperty({ description: '字段类型' })
  Type: string;

  @ApiProperty({ description: '字符集', required: false })
  Collation: string | null;

  @ApiProperty({ description: '是否可为空' })
  Null: string;

  @ApiProperty({ description: '键类型' })
  Key: string;

  @ApiProperty({ description: '默认值', required: false })
  Default: any;

  @ApiProperty({ description: '额外信息' })
  Extra: string;

  @ApiProperty({ description: '权限信息' })
  Privileges: string;

  @ApiProperty({ description: '字段注释' })
  Comment: string;
}

export class TableSchemaDto {
  @ApiProperty({ description: '表名' })
  tableName: string;

  @ApiProperty({ description: '表类型', required: false })
  tableType?: string;

  @ApiProperty({ description: '数据库引擎', required: false })
  engine?: string;

  @ApiProperty({ description: '表注释', required: false })
  comment?: string;

  @ApiProperty({ description: '列信息', type: [ColumnSchemaDto] })
  columns: ColumnSchemaDto [];
}
