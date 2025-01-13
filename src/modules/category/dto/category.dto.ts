import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ 
    description: '分类名称',
    example: '系统设置'
  })
  @IsNotEmpty({ message: '分类名称不能为空' })
  @Length(2, 50)
  name: string;

  @ApiProperty({ 
    description: '分类编码',
    example: 'system_setting'
  })
  @IsNotEmpty({ message: '分类编码不能为空' })
  @Length(2, 50)
  code: string;

  @ApiProperty({ 
    description: '分类类型',
    example: 'dict'
  })
  @IsNotEmpty({ message: '分类类型不能为空' })
  type: string;

  @ApiProperty({ 
    description: '父级ID',
    required: false,
    example: null
  })
  @IsOptional()
  parentId?: string;
}

export class QueryCategoryDto {
  @ApiProperty({ description: '分类名称', required: false })
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '分类编码', required: false })
  @IsOptional()
  code?: string;

  @ApiProperty({ description: '分类类型', required: false })
  @IsOptional()
  type?: string;

  @ApiProperty({ description: '父级ID', required: false })
  @IsOptional()
  parentId?: string;

  @ApiProperty({ description: '页码', default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ description: '每页数量', default: 10 })
  @IsOptional()
  limit?: number = 10;
} 