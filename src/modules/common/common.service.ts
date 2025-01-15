import { Injectable } from '@nestjs/common';
import { Repository, getMetadataArgsStorage } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class CommonService {
  constructor(protected readonly repository: Repository<any>) {
  }

  // 原有方法
  protected setCreateInfo(entity: any, req: Request) {
    entity.sysCreateIp = req['realIp'];
    // entity.creator = req['user']?.id || 'system';
    // entity.sysIsDel = null;
    return entity;
  }

  protected setUpdateInfo(entity: any, req: Request) {
    entity.sysUpdateIp = req['realIp'];
    // entity.updater = req['user']?.id || 'system';
    return entity;
  }
} 