import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getMetadataArgsStorage, In, Repository } from 'typeorm';
import { NavUrl } from "./navUrl.entity";
import { queryParams } from '../../common/sqlUtil'
import * as xlsx from 'xlsx';
import * as xml2js from 'xml2js';
import { Response } from 'express';
// import { QueryCondition } from 'src/interfaces/queryCondition.interface';
import { CommonService } from '../../common/common.service';
@Injectable()
export class NavUrlService extends CommonService {
  constructor(
    @InjectRepository(NavUrl)
    protected readonly repository: Repository<NavUrl>,
  ) { 
    super(repository);
  }

  async findOne( id) {
    return await this.repository.findOne({ where: { sysIsDel: '0',  id } });
  }

  async findOneByParam(param) {
    return await this.repository.findOne({ where: { sysIsDel: '0', ...param } });
  }

  async findAll() {
    return (await this.repository.find()).filter(item => item.sysIsDel == '0')
  }

  async deleteBatch(ids: string[]): Promise<void> {
    const dataList = await this.repository.findByIds(ids)
    const delList = dataList.map(item => {
      return {
        ...item,
        sysIsDel: null
      }
    })
    return await this.updateBatch(delList)
  }

  async exportByExcel(query: any, res: Response) {
    const data = await this.queryList(query);
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  // 导出为JSON
  async exportByJson(query: any) {
    const data = await this.queryList(query);
    return JSON.stringify(data, null, 2);
  }

  // 导出为XML
  async exportByXml(query: any) {
    const data = await this.queryList(query);
    const builder = new xml2js.Builder();
    return builder.buildObject({ projectList: { project: data } });
  }

  // 获取导入模板
  downloadNavUrlTemplate() {
    // 获取实体的元数据
    const metadata = getMetadataArgsStorage().columns.filter(
      column => column.target === NavUrl
    );

    // 根据元数据创建列定义
    const columns = metadata.map(column => ({
      header: `${column.propertyName}${column.options.nullable ? '' : ' *'}`,
      key: column.propertyName,
      width: 20
    }));

    // 创建空模板行
    const template = [
      metadata.reduce((obj, column) => {
        obj[column.propertyName] = '';
        return obj;
      }, {})
    ];

    const ws = xlsx.utils.json_to_sheet(template);
    ws['!cols'] = columns.map(col => ({ width: col.width }));

    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Template');
    
    return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  // 导入数据
  async importFromExcel(file: Buffer, req: Request) {
    const wb = xlsx.read(file);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(ws) as NavUrl[];
    return this.insertBatch(data);
  }
  async getItem( id: string) {
    return this.findOne( id);
  }

  async insert(entity: NavUrl) {
    const { identifiers } = await this.repository.insert(entity);
    return this.findOne(identifiers[0]. id)
  }

  async insertBatch(entity: NavUrl[]) {
    const { identifiers } = await this.repository.createQueryBuilder().insert().values(entity).execute()
    return await this.repository.find({
      where: {
         id: In(identifiers.map(item => item. id))
      }
    })
  }
  // 获取分页
  async queryList(params: any) {
    return queryParams(params, this)
  }
  save(entity: NavUrl) {
    return this.repository.save(entity);

  }
  saveBatch(entity: NavUrl[]) {
    return this.repository.save(entity);
  }

  async update(entity: NavUrl) {
    const existingData = await this.findOne(entity. id);
    const mergedNavUrl = this.repository.merge(existingData, entity);
    this.repository.update(entity. id, mergedNavUrl)
  }

  async updateBatch(entity: NavUrl[]) {
    for await (const entityItem of entity) {
      this.update(entityItem)
    }
  }
}
