import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getMetadataArgsStorage, In, Repository } from 'typeorm';
import { DpTemplate } from "./dpTemplate.entity";
import { queryParams } from '../../common/sqlUtil'
import * as xlsx from 'xlsx';
import * as xml2js from 'xml2js';
import { Response } from 'express';
// import { QueryCondition } from 'src/interfaces/queryCondition.interface';
import { CommonService } from '../../common/common.service';
import { nanoid } from 'nanoid';
@Injectable()
export class DpTemplateService extends CommonService {
  constructor(
    @InjectRepository(DpTemplate)
    protected readonly repository: Repository<DpTemplate>,
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

  async delete(id: string,req): Promise<void> {
    const entity = await this.findOne(id)
    return await this.update({...entity,sysIsDel: null},req)
  }

  async deleteBatch(ids: string[],req): Promise<void> {
    const dataList = await this.repository.findByIds(ids)
    const delList = dataList.map(item => {
      return {
        ...item,
        sysIsDel: null
      }
    })
    return await this.updateBatch(delList,req)
  }

  async exportByExcel(query: any) {
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
  downloadDpTemplateTemplate() {
    // 获取实体的元数据
    const metadata = getMetadataArgsStorage().columns.filter(
      column => column.target === DpTemplate && !column.propertyName.startsWith('sys')
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
    const data = xlsx.utils.sheet_to_json(ws) as DpTemplate[];
    return this.insertBatch(data,req);
  }
  async getItem( id: string) {
    return this.findOne( id);
  }

  async insert(entity: Partial<DpTemplate>,req) {
    const { identifiers } = await this.repository.insert(this._createEntity(entity,req));
    return this.findOne(identifiers[0]. id)
  }

  async insertBatch(entitys: Partial<DpTemplate>[],req) {
    const insertData = entitys.map(entity=>this._createEntity(entity,req))
    const { identifiers } = await this.repository.createQueryBuilder().insert().values(insertData).execute()
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
  async save(entity: Partial<DpTemplate>,req) {
    if(entity.id){
      const data = await this.findOne(entity.id)
      if(!data){
        return this.insert(entity,req)
      }else{
        return this.update(entity,req)
      }
    }else{
      return this.insert(entity,req)
    }
  }
  async saveBatch(entity: Partial<DpTemplate>[],req) {
    for await (const entityItem of entity) {
      this.save(entityItem,req)
    }
  }

  async update(entity: Partial<DpTemplate>,req) {
    const existingData = await this.findOne(entity.id);
    if(!existingData){
      throw new Error('数据不存在')
    }
    const mergeData =this.repository.merge(existingData, entity);
    this.repository.update(entity.id,this._updateEntity(mergeData,req))
  }

  async updateBatch(entity: Partial<DpTemplate>[],req) {
    for await (const entityItem of entity) {
      this.update(this._updateEntity(entityItem,req),req)
    }
  }

  _createEntity(entity: Partial<DpTemplate>,req) {
    const dpTemplate = new DpTemplate(); // 创建实体实例
    if(!entity.id){
      entity.id = nanoid()
    }
    this.setCreateInfo(entity,req)
    Object.assign(dpTemplate, entity); // 复制属性
    return dpTemplate;
  }
  _updateEntity(entity: Partial<DpTemplate>,req) {
    const dpTemplate = new DpTemplate(); // 创建实体实例
    this.setUpdateInfo(entity,req)
    Object.assign(dpTemplate, entity); // 复制属性
    return dpTemplate;
  }
}
