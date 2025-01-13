import { Injectable } from '@nestjs/common';
import { Repository, getMetadataArgsStorage } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class CommonService {
  private entityFields: string[];
  private commonFields = [
    'createTime', 'createIp', 'creator',
    'updateTime', 'updateIp', 'updater',
    'sysIsDel'
  ];

  constructor(protected readonly repository: Repository<any>) {
    this.entityFields = this.getEntityFields();
  }

  // 原有方法
  protected setCreateInfo(entity: any, req: Request) {
    entity.createTime = new Date().toISOString();
    entity.createIp = req['realIp'];
    entity.creator = req['user']?.id || 'system';
    entity.sysIsDel = null;
    return entity;
  }

  protected setUpdateInfo(entity: any, req: Request) {
    entity.updateTime = new Date().toISOString();
    entity.updateIp = req['realIp'];
    entity.updater = req['user']?.id || 'system';
    return entity;
  }

  protected setSoftDelete(entity: any, req: Request) {
    entity.sysIsDel = '0';
    return this.setUpdateInfo(entity, req);
  }

  protected getBaseWhere() {
    return { sysIsDel: null };
  }

  // 新增的重排序相关方法
  private getEntityFields(): string[] {
    const target = this.repository.metadata.target;
    const columns = getMetadataArgsStorage().columns
      .filter(column => column.target === target)
      .map(column => column.propertyName);
    return columns.filter(field => !this.commonFields.includes(field));
  }

  private reorderResults(result: any | any[]) {
    if (!result) return result;

    const orderFields = [...this.entityFields, ...this.commonFields];

    const reorderObject = (obj: any) => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      const ordered = {};
      orderFields.forEach(key => {
        if (key in obj) {
          ordered[key] = obj[key];
        }
      });
      Object.keys(obj).forEach(key => {
        if (!(key in ordered)) {
          ordered[key] = obj[key];
        }
      });
      return ordered;
    };

    if (Array.isArray(result)) {
      return result.map(item => reorderObject(item));
    }
    return reorderObject(result);
  }

  protected reorderResponse() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const originalMethod = descriptor.value;
      
      descriptor.value = async function(...args: any[]) {
        const result = await originalMethod.apply(this, args);
        return this.reorderResults(result);
      };
      
      return descriptor;
    };
  }

  protected async withReorder<T>(promise: Promise<T>): Promise<T> {
    const result = await promise;
    return this.reorderResults(result);
  }
} 