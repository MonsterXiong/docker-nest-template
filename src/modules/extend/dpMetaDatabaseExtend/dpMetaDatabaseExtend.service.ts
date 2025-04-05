import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DpMetaDatabase } from 'src/modules/base/dpMetaDatabase';
import {
  DpMetaEntity,
  DpMetaEntityService,
} from 'src/modules/base/dpMetaEntity';
import {
  DpMetaEntityAttr,
  DpMetaEntityAttrService,
} from 'src/modules/base/dpMetaEntityAttr';
import { Repository } from 'typeorm';
import QueryConditionBuilder from 'src/utils/queryCondition';
import { refreshEntities } from './dpMetaDatabaseExtend.utils';
import { CommonService } from '../common/common.service';
import { MetaDatabaseAdapter } from './adapter/MetaDatabaseAdapter';
import { outputCode } from 'src/utils/outputCode';
import { format } from '../dpGen/dbGen.utils';
import { DpMetaEnum } from 'src/modules/base/dpMetaEnum';
import { DpMetaEnumItem } from 'src/modules/base/dpMetaEnumItem';
import { formatEnum } from './adapter/formatEnum';
@Injectable()
export class DpMetaDatabaseExtendService {
  constructor(
    private readonly dpMetaEntityService: DpMetaEntityService,
    private readonly dpMetaEntityAttrService: DpMetaEntityAttrService,
    private readonly commonService: CommonService,
    
    @InjectRepository(DpMetaDatabase)
    private readonly dpMetaDatabaseRepository: Repository<DpMetaDatabase>,

    @InjectRepository(DpMetaEntity)
    private readonly dpMetaEntityRepository: Repository<DpMetaEntity>,

    @InjectRepository(DpMetaEnum)
    private readonly dpMetaEnumRepository: Repository<DpMetaEnum>,
  ) {}

  async getMetaDatabase() {
    const data = await this.dpMetaDatabaseRepository
      .createQueryBuilder('a')
      .leftJoinAndMapMany(
        'a.entities',
        DpMetaEntity,
        'b',
        'b.bindDatabase = a.id AND b.sys_is_del IS NOT NULL',
      )
      .leftJoinAndMapMany(
        'b.attributes',
        DpMetaEntityAttr,
        'c',
        'c.bindEntity = b.id AND c.sys_is_del IS NOT NULL  AND c.code = :code',
        {code:'bind_project'}
      )
      .printSql()
      .getMany();
    return data;
  }

  async getMetaEnum(databaseId){
    const data = await this.dpMetaEnumRepository
    .createQueryBuilder('a')
      .leftJoinAndMapMany(
        'a.attributes',
        DpMetaEnumItem,
        'b',
        'b.bindEnum = a.id AND b.sys_is_del IS NOT NULL',
      )
      .where('a.bind_database = :id',{id:databaseId})
      .getMany();
    return data;
  }

  async getMetaDatabaseById(id) {
    const data = await this.dpMetaDatabaseRepository
      .createQueryBuilder('a')
      .leftJoinAndMapMany(
        'a.entities',
        DpMetaEntity,
        'b',
        'b.bindDatabase = a.id AND b.sys_is_del IS NOT NULL',
      )
      .leftJoinAndMapMany(
        'b.attributes',
        DpMetaEntityAttr,
        'c',
        'c.bindEntity = b.id AND c.sys_is_del IS NOT NULL',
      )
      .where('a.id = :id', { id })
      .printSql()
      .getOne();
    return data;
  }

  async getMetaEnumById(id) {
    const data = await this.dpMetaEnumRepository
      .createQueryBuilder('a')
      .leftJoinAndMapMany(
        'a.attributes',
        DpMetaEnumItem,
        'b',
        'b.bindEnum = a.id AND b.sys_is_del IS NOT NULL',
      )
      .where('a.id = :id', { id })
      .getOne();
    return data;
  }

  

  async getMetaEntityById(id) {
    const data = await this.dpMetaEntityRepository
      .createQueryBuilder('a')
      .leftJoinAndMapMany(
        'a.attributes',
        DpMetaEntityAttr,
        'b',
        'b.bindEntity = a.id AND b.sys_is_del IS NOT NULL',
      )
      .where('a.id = :id', { id })
      .getOne();
    return data;
  }

  async copyMetaDatabase(source, target, req) {
    if (!source) {
      throw new Error('未传被引用的数据体系Id');
    }
    if (!target) {
      throw new Error('未传当前数据体系Id');
    }
    const database: any = await this.getMetaDatabaseById(source);

    const { entityList,attrList} = refreshEntities( database.entities,target)

    return this._batctInsertEntityAndAttr(entityList,attrList,req)
  }


  async copyEntity(entityIds,databaseId,req){
    if(!entityIds?.length){
      throw new Error('元对象不能为空')
    }
    // TODO:优化
    const entityQueryCondition = QueryConditionBuilder.getInstanceNoPage().buildInQuery('id',entityIds)
    const {data:entities} =await this.dpMetaEntityService.queryList(entityQueryCondition)
    const queryCondition = QueryConditionBuilder.getInstanceNoPage().buildInQuery('bindEntity',entityIds)
    const {data:attrs} = await this.dpMetaEntityAttrService.queryList(queryCondition)
    entities.forEach(item=>{
      item.attributes = attrs.filter(attr=>attr.bindEntity === item.id)
    })
    const { entityList,attrList} = refreshEntities(entities,databaseId)
    return this._batctInsertEntityAndAttr(entityList,attrList,req)
  }

  async _batctInsertEntityAndAttr(entityInfo,attributes,req){
    return Promise.all([
      this.dpMetaEntityService.insertBatch(entityInfo, req),
      this.dpMetaEntityAttrService.insertBatch(attributes, req),
    ]);
  }


  async genSql(id,res){
    const result = await this.getSql(id)
    return outputCode(res, result, 'mysql');
  }
  
  async getSql(id){
    const metaDatabase = await this.getMetaDatabaseById(id)
    const adapter = new MetaDatabaseAdapter();
    const paramsData = adapter.convert(metaDatabase);
    const result = this.commonService.getCode(
      {},
      paramsData,
      'mysql',
      true,
    );
    return format(result, true, 'name');
  }

  async genEnum(id,res){
    const result = await this.getEnum(id)
    return outputCode(res, result, 'meta_enum');
  }
  
  async getEnum(id){
    const enumList = await this.getMetaEnum(id)
    const paramsData = formatEnum(enumList)
    const result = this.commonService.getCode(
      {},
      paramsData,
      'meta_enum',
      false,
    );
    return format(result, false, 'code');
  }

  async genEnumById(enumId,res){
    const result = await this.getEnumById(enumId)
    return outputCode(res, result, 'meta_enum');
  }
  
  async getEnumById(enumId){
    const  enumData = await this.getMetaEnumById(enumId)
    const paramsData = formatEnum([enumData])
    // // 清洗数据，还需要考虑命名的问题
    const result = this.commonService.getCode(
      {},
      [paramsData[0]],
      'meta_enum',
      false,
    );
    
    return format(result, false, 'code');
  }

  async getTableSql(entityId){
    const metaEntity = await this.getMetaEntityById(entityId)
    const adapter = new MetaDatabaseAdapter();
    const paramsData = adapter.convertTable(metaEntity);
    const result = this.commonService.getCode(
      {},
      paramsData,
      'mysqlTable',
      true,
    );
    return format(result, true, 'name');
  }

  async genTableSql(id,res){
    const result = await this.getTableSql(id)
    return outputCode(res, result, 'mysqlTable');
  }
}
