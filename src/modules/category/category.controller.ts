import { 
  Controller, Get, Post, Put, Delete, Body, Param, Query, 
  Res, UseInterceptors, UploadedFile, ParseArrayPipe,
  DefaultValuePipe, ParseIntPipe 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBody, ApiQuery, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { CategoryService } from './category.service';
import { CreateCategoryDto, QueryCategoryDto } from './dto/category.dto';
import { Request } from 'express';
import { Req } from '@nestjs/common';

@ApiTags('分类管理')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}



  @Post('query')
  @ApiOperation({ summary: '自定义查询' })
  findByCustom(@Body() query: QueryCategoryDto) {
    return this.categoryService.findByCustom(query);
  }

  @Post()
  @ApiOperation({ summary: '创建分类' })
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request) {
    return this.categoryService.create(createCategoryDto, req);
  }

  @Post('batch')
  @ApiOperation({ summary: '批量创建分类' })
  @ApiBody({
    type: [CreateCategoryDto],
    description: '分类数组',
    examples: {
      example1: {
        value: [
          {
            name: '系统设置',
            code: 'system_setting',
            type: 'dict',
            parentId: null
          },
          {
            name: '用户状态',
            code: 'user_status',
            type: 'dict',
            parentId: null
          }
        ]
      }
    }
  })
  createMany(@Body() dtos: CreateCategoryDto[], @Req() req: Request) {
    return this.categoryService.createMany(dtos, req);
  }

  @Put()
  @ApiOperation({ summary: '更新分类' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          description: '分类ID',
          example: '1'
        },
        name: {
          type: 'string',
          description: '分类名称',
          example: '系统设置'
        },
        code: {
          type: 'string',
          description: '分类编码',
          example: 'system_setting'
        },
        type: {
          type: 'string',
          description: '分类类型',
          example: 'dict'
        },
        parentId: {
          type: 'string',
          description: '父级ID',
          example: null
        }
      },
      example: {
        id: '1',
        name: '系统设置',
        code: 'system_setting'
      }
    }
  })
  update(@Body() updateData: Partial<CreateCategoryDto> & { id: string }, @Req() req: Request) {
    const { id, ...data } = updateData;
    return this.categoryService.update(id, data, req);
  }

  @Put('batch')
  @ApiOperation({ summary: '批量更新分类' })
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
            description: '分类ID',
            example: '1'
          },
          name: {
            type: 'string',
            description: '分类名称',
            example: '系统设置'
          },
          code: {
            type: 'string',
            description: '分类编码',
            example: 'system_setting'
          },
          type: {
            type: 'string',
            description: '分类类型',
            example: 'dict'
          },
          parentId: {
            type: 'string',
            description: '父级ID',
            example: null
          }
        }
      },
      example: [
        {
          id: '1',
          name: '系统设置',
          code: 'system_setting'
        },
        {
          id: '2',
          type: 'dict',
          parentId: '1'
        }
      ]
    }
  })
  updateMany(@Body() updates: (Partial<CreateCategoryDto> & { id: string })[], @Req() req: Request) {
    return this.categoryService.updateMany(updates, req);
  }



  @Delete('batch')
  @ApiOperation({ summary: '批量删除分类' })
  @ApiBody({
    type: 'object',
    description: '分类ID数组',
    examples: {
      example1: {
        value: {
          ids: ['1', '2', '3']
        },
        summary: 'ID数组示例'
      }
    },
    schema: {
      properties: {
        ids: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: '要删除的分类ID数组'
        }
      }
    }
  })
  removeMany(@Body('ids', new ParseArrayPipe({ items: String })) ids: string[], @Req() req: Request) {
    return this.categoryService.removeMany(ids, req);
  }

  @Get('export/excel')
  @ApiOperation({ summary: '导出Excel' })
  async exportExcel(@Query() query: QueryCategoryDto, @Res() res: Response) {
    const buffer = await this.categoryService.exportToExcel(query);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=categories.xlsx');
    res.send(buffer);
  }

  @Get('export/json')
  @ApiOperation({ summary: '导出JSON' })
  async exportJson(@Query() query: QueryCategoryDto, @Res() res: Response) {
    const json = await this.categoryService.exportToJson(query);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=categories.json');
    res.send(json);
  }

  @Get('export/xml')
  @ApiOperation({ summary: '导出XML' })
  async exportXml(@Query() query: QueryCategoryDto, @Res() res: Response) {
    const xml = await this.categoryService.exportToXml(query);
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', 'attachment; filename=categories.xml');
    res.send(xml);
  }

  @Get('import/template')
  @ApiOperation({ summary: '下载导入模板' })
  async downloadTemplate(@Res() res: Response) {
    const buffer = this.categoryService.getImportTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=category_template.xlsx');
    res.send(buffer);
  }

  @Post('import')
  @ApiOperation({ summary: '导入分类数据' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Excel文件（.xlsx）'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(xlsx|xls)$/)) {
        return callback(new Error('只支持 .xlsx 或 .xls 文件!'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 1024 * 1024 * 5 // 限制5MB
    }
  }))
  async import(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new Error('请选择要导入的文件');
    }
    return this.categoryService.importFromExcel(file.buffer, req);
  }

  @Post('save')
  @ApiOperation({ summary: '保存分类（新增或更新）' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'code', 'type'],  // 指定必填字段
      properties: {
        id: {
          type: 'string',
          description: '分类ID（更新时必填）',
          example: '1'
        },
        name: {
          type: 'string',
          description: '分类名称',
          example: '系统设置'
        },
        code: {
          type: 'string',
          description: '分类编码',
          example: 'system_setting'
        },
        type: {
          type: 'string',
          description: '分类类型',
          example: 'dict'
        },
        parentId: {
          type: 'string',
          description: '父级ID',
          example: null
        }
      }
    }
  })
  save(@Body() categoryDto: CreateCategoryDto & { id?: string }, @Req() req: Request) {
    if (categoryDto.id) {
      return this.categoryService.update(categoryDto.id, categoryDto, req);
    }
    return this.categoryService.create(categoryDto, req);
  }

  @Post('batch-save')
  @ApiOperation({ summary: '批量保存分类' })
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'code', 'type'],  // 指定必填字段
        properties: {
          id: {
            type: 'string',
            description: '分类ID（更新时必填）',
            example: '1'
          },
          name: {
            type: 'string',
            description: '分类名称',
            example: '系统设置'
          },
          code: {
            type: 'string',
            description: '分类编码',
            example: 'system_setting'
          },
          type: {
            type: 'string',
            description: '分类类型',
            example: 'dict'
          },
          parentId: {
            type: 'string',
            description: '父级ID',
            example: null
          }
        }
      },
      example: [
        {
          id: '1',
          name: '系统设置',
          code: 'system_setting',
          type: 'dict',
          parentId: null
        },
        {
          name: '用户状态',
          code: 'user_status',
          type: 'dict',
          parentId: null
        }
      ]
    }
  })
  batchSave(@Body() categories: (CreateCategoryDto & { id?: string })[], @Req() req: Request) {
    return this.categoryService.batchSave(categories, req);
  }

  @Post('batch-query')
  @ApiOperation({ summary: '批量查询分类' })
  @ApiBody({
    type: 'object',
    description: '分类ID数组',
    examples: {
      example1: {
        value: {
          ids: ['1', '2', '3']
        },
        summary: 'ID数组示例'
      }
    },
    schema: {
      properties: {
        ids: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    }
  })
  batchQuery(@Body('ids', new ParseArrayPipe({ items: String })) ids: string[]) {
    return this.categoryService.findByIds(ids);
  }

  @Get('list')
  @ApiOperation({ summary: '获取分类列表' })
  @ApiQuery({ 
    name: 'page', 
    description: '页码', 
    required: false, 
    type: Number, 
    example: 1,
    schema: { default: 1 }
  })
  @ApiQuery({ 
    name: 'limit', 
    description: '每页数量', 
    required: false, 
    type: Number, 
    example: 10,
    schema: { default: 10 }
  })
  @ApiQuery({ 
    name: 'name', 
    description: '分类名称', 
    required: false, 
    type: String, 
    example: '系统设置',
    schema: { default: '' }
  })
  @ApiQuery({ 
    name: 'code', 
    description: '分类编码', 
    required: false, 
    type: String, 
    example: 'system_setting',
    schema: { default: '' }
  })
  @ApiQuery({ 
    name: 'type', 
    description: '分类类型', 
    required: false, 
    type: String, 
    example: 'dict',
    schema: { default: '' }
  })
  async getList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('name', new DefaultValuePipe('')) name: string,
    @Query('code', new DefaultValuePipe('')) code: string,
    @Query('type', new DefaultValuePipe('')) type: string,
  ) {
    
    try {
      const result = await this.categoryService.getList({ page, limit, name, code, type });
      return result;
    } catch (error) {
      console.error('getList 错误:', error);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个分类' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除分类' })
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.categoryService.remove(id, req);
  }
} 