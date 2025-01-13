import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto, QueryCategoryDto } from './dto/category.dto';
import { CommonService } from '../common/common.service';
import * as xlsx from 'xlsx';
import * as xml2js from 'xml2js';
import { Request } from 'express';

@Injectable()
export class CategoryService extends CommonService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    super(categoryRepository);
  }

  // 单条查询
  async findOne(id: string) {
    return this.categoryRepository.findOne({ 
      where: { 
        id,
        sysIsDel: IsNull()  // 只查询未删除的数据
      } 
    });
  }

  // 批量查询
  async findByIds(ids: string[]) {
    return this.categoryRepository.find({ 
      where: { 
        id: In(ids),
        sysIsDel: IsNull()  // 只查询未删除的数据
      } 
    });
  }

  // 自定义查询
  async findByCustom(query: QueryCategoryDto) {
    const { page = 1, limit = 10, ...where } = query;
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    // 添加未删除条件
    queryBuilder.where('category.sysIsDel IS NULL');

    // 构建其他查询条件
    Object.keys(where).forEach(key => {
      if (where[key]) {
        queryBuilder.andWhere(`category.${key} LIKE :${key}`, { [key]: `%${where[key]}%` });
      }
    });

    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      meta: {
        total,
        page: +page,
        limit: +limit,
      },
    };
  }

  // 新增
  async create(createCategoryDto: CreateCategoryDto, req: Request) {
    const category = this.categoryRepository.create(createCategoryDto);
    this.setCreateInfo(category, req);
    return this.categoryRepository.save(category);
  }

  // 批量新增
  async createMany(createCategoryDtos: CreateCategoryDto[], req: Request) {
    const categories = createCategoryDtos.map(dto => {
      const category = this.categoryRepository.create(dto);
      this.setCreateInfo(category, req);
      return category;
    });
    return this.categoryRepository.save(categories);
  }

  // 更新
  async update(id: string, updateCategoryDto: Partial<CreateCategoryDto>, req: Request) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) return IsNull();
    
    Object.assign(category, updateCategoryDto);
    this.setUpdateInfo(category, req);
    return this.categoryRepository.save(category);
  }

  // 批量更新
  async updateMany(updates: (Partial<CreateCategoryDto> & { id: string })[], req: Request) {
    try {
      // 先查询所有要更新的记录
      const ids = updates.map(update => update.id);
      const existingCategories = await this.categoryRepository.find({
        where: { 
          id: In(ids),
          sysIsDel: IsNull()  // 确保只处理未删除的记录
        }
      });

      // 过滤出存在且未删除的记录
      const validIds = existingCategories.map(cat => cat.id);
      const validUpdates = updates.filter(update => validIds.includes(update.id));

      const results = [];
      for (const update of validUpdates) {
        const { id, ...updateData } = update;
        const result = await this.update(id, updateData, req);
        results.push(result);
      }

      return {
        success: true,
        message: `成功更新 ${results.length} 条记录，跳过 ${updates.length - results.length} 条无效记录`,
        data: results
      };
    } catch (error) {
      console.error('批量更新错误:', error);
      return {
        success: false,
        message: '更新失败',
        data: null
      };
    }
  }

  // 删除
  async remove(id: string, req: Request) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) return IsNull();
    
    this.setSoftDelete(category, req);
    return this.categoryRepository.save(category);
  }

  // 批量删除
  async removeMany(ids: string[], req: Request) {
    console.log(ids);
    
    try {
      // 先查询所有要删除的记录
      const categories = await this.categoryRepository.find({
        where: { 
          id: In(ids),
          sysIsDel: IsNull()  // 确保只处理未删除的记录
        }
      });

      if (!categories.length) {
        return { success: false, message: '未找到要删除的记录' };
      }

      // 设置删除标记
      const updatedCategories = categories.map(category => {
        category.sysIsDel = '0';  // 设置删除标记
        this.setUpdateInfo(category, req);  // 更新修改信息
        return category;
      });

      // 保存更新
      await this.categoryRepository.save(updatedCategories);

      return { 
        success: true, 
        message: `成功删除 ${updatedCategories.length} 条记录`,
        data: updatedCategories 
      };
    } catch (error) {
      console.error('批量删除错误:', error);
      return { success: false, message: '删除失败' };
    }
  }

  // 导出为Excel
  async exportToExcel(query: QueryCategoryDto) {
    const { items } = await this.findByCustom(query);
    const ws = xlsx.utils.json_to_sheet(items);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Categories');
    return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  // 导出为JSON
  async exportToJson(query: QueryCategoryDto) {
    const { items } = await this.findByCustom(query);
    return JSON.stringify(items, null, 2);
  }

  // 导出为XML
  async exportToXml(query: QueryCategoryDto) {
    const { items } = await this.findByCustom(query);
    const builder = new xml2js.Builder();
    return builder.buildObject({ categories: { category: items } });
  }

  // 获取导入模板
  getImportTemplate() {
    const template = [
      {
        name: '示例分类',
        code: 'example_code',
        type: 'dict',
        parentId: '',
      }
    ];
    const ws = xlsx.utils.json_to_sheet(template);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Template');
    return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  // 导入数据
  async importFromExcel(file: Buffer, req: Request) {
    const wb = xlsx.read(file);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(ws) as CreateCategoryDto[];
    return this.createMany(data, req);
  }

  async batchSave(categories: (CreateCategoryDto & { id?: string })[], req: Request) {
    const results = [];
    for (const category of categories) {
      if (category.id) {
        const result = await this.update(category.id, category, req);
        results.push(result);
      } else {
        const result = await this.create(category, req);
        results.push(result);
      }
    }
    return results;
  }

  // 获取列表
  async getList(params: { page?: number; limit?: number; name?: string; code?: string; type?: string }) {
    const { 
      page = 1, 
      limit = 10, 
      name = '', 
      code = '', 
      type = '' 
    } = params;

    try {
      const queryBuilder = this.categoryRepository.createQueryBuilder('category');

      // 修改未删除条件的写法
      queryBuilder.where('(category.sysIsDel IS NULL OR category.sysIsDel != :sysIsDel)', { sysIsDel: "0" });

      // 只有在有值的情况下才添加条件
      if (name.trim()) {
        queryBuilder.andWhere('category.name LIKE :name', { name: `%${name.trim()}%` });
      }
      if (code.trim()) {
        queryBuilder.andWhere('category.code LIKE :code', { code: `%${code.trim()}%` });
      }
      if (type.trim()) {
        queryBuilder.andWhere('category.type = :type', { type: type.trim() });
      }

      // 修改排序语句，使用 IFNULL 处理空值
      queryBuilder.orderBy('IFNULL(category.sysSort, 999999)', 'ASC');

      const [items, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
          data:items,
          total,
          page,
          limit,
      };
    } catch (error) {
      console.error('getList error:', error);
      return {
          data: [],
          total: 0,
          page,
          limit,
      };
    }
  }
} 