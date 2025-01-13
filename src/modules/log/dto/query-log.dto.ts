import { IsOptional, IsNumber, Min, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryLogDto {
  @ApiProperty({ 
    description: '页码', 
    default: 1,
    required: false 
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ 
    description: '每页数量', 
    default: 10,
    required: false 
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
 
  @ApiProperty({ 
    description: '开始时间', 
    required: false 
  })
  @IsDateString()
  @IsOptional()
  startTime?: string;

  @ApiProperty({ 
    description: '结束时间', 
    required: false 
  })
  @IsDateString()
  @IsOptional()
  endTime?: string;
}

export class LogPaginatedResponseDto {
  @ApiProperty({ description: '总记录数' })
  total: number;

  @ApiProperty({ description: '当前页码' })
  page: number;

  @ApiProperty({ description: '每页数量' })
  limit: number;

  @ApiProperty({ description: '总页数' })
  totalPages: number;

  @ApiProperty({ description: '数据列表', type: 'array' })
  items: any[];
} 