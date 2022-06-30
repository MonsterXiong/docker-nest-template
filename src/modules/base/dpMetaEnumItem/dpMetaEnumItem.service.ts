import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getMetadataArgsStorage, In, Repository } from 'typeorm';
import { DpMetaEnumItem } from "./dpMetaEnumItem.entity";
import { queryParams } from '../../common/sqlUtil'
import * as xlsx from 'xlsx';
import * as xml2js from 'xml2js';
import { Response } from 'express';
// import { QueryCondition } from 'src/interfaces/queryCondition.interface';
import { CommonService } from '../../common/common.service';
import { nanoid } from 'nanoid';
@Injectable()
export class DpMetaEnumItemService extends CommonService {
  constructor(
    @InjectRepository(DpMetaEnumItem)
    protected readonly repository: Repository<DpMetaEnumItem>,
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
  downloadDpMetaEnumItemTemplate() {
    // 获取实体的元数据
    const metadata = getMetadataArgsStorage().columns.filter(
      column => column.target === DpMetaEnumItem && !column.propertyName.startsWith('sys')
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
    const data = xlsx.utils.sheet_to_json(ws) as DpMetaEnumItem[];
    return this.insertBatch(data,req);
  }
  async getItem( id: string) {
    return this.findOne( id);
  }

  async insert(entity: Partial<DpMetaEnumItem>,req) {
    const { identifiers } = await this.repository.insert(this._createEntity(entity,req));
    return this.findOne(identifiers[0]. id)
  }

  async insertBatch(entitys: Partial<DpMetaEnumItem>[],req) {
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
  async save(entity: Partial<DpMetaEnumItem>,req) {
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
 
  async saveBatch(newObjectList: Partial<DpMetaEnumItem>[],oldKeyList:string[],req) {
    let newList = newObjectList
    let oldList = oldKeyList
    if(!newObjectList){
      newList = []
    }
    // 主键处理
    newList.forEach(item => {
      // 主键
      if(!item.id){
        item.id = nanoid()
      }
    });

    const objectList_update = [];//待更新
		const objectList_insert = [];//待新增
		const idList_new = []; // 新主键ids
    
    newList.forEach(item => {
      idList_new.push(item.id)
			if(oldList.includes(item.id)){ // 判断对象时需要调用新增方法还是更新方法
				objectList_update.push(item); // 添加至待更新集合
			}else{
				objectList_insert.push(item); // 添加至待新增集合
			}
    });
    const idList_delete = oldList.filter(item => !idList_new.includes(item)); //待删除

    const [deleteList,updateList,insertList] = await Promise.all([this.deleteBatch(idList_delete,req),this.updateBatch(objectList_update,req),this.insertBatch(objectList_insert,req)])

		return {
      deleteList,
      updateList,
      insertList
    };
  }

  async update(entity: Partial<DpMetaEnumItem>,req) {
    const existingData = await this.findOne(entity.id);
    if(!existingData){
      throw new Error('数据不存在')
    }
    const mergeData =this.repository.merge(existingData, entity);
    this.repository.update(entity.id,this._updateEntity(mergeData,req))
  }

  async updateBatch(entity: Partial<DpMetaEnumItem>[],req) {
    for await (const entityItem of entity) {
      await this.update(this._updateEntity(entityItem,req),req)
    }
    return
  }

  _createEntity(entity: Partial<DpMetaEnumItem>,req) {
    const dpMetaEnumItem = new DpMetaEnumItem(); // 创建实体实例
    if(!entity.id){
      entity.id = nanoid()
    }
    this.setCreateInfo(entity,req)
    Object.assign(dpMetaEnumItem, entity); // 复制属性
    return dpMetaEnumItem;
  }
  _updateEntity(entity: Partial<DpMetaEnumItem>,req) {
    const dpMetaEnumItem = new DpMetaEnumItem(); // 创建实体实例
    this.setUpdateInfo(entity,req)
    Object.assign(dpMetaEnumItem, entity); // 复制属性
    return dpMetaEnumItem;
  }
}
