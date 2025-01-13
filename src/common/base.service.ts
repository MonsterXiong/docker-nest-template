// import { Repository, In, IsNull } from 'typeorm';
// import { Request } from 'express';
// import * as xlsx from 'xlsx';
// import * as xml2js from 'xml2js';
// import { CommonService } from 'src/modules/common/common.service';

// export class BaseService<T>  extends CommonService{
//   protected primaryKey: string;

//   constructor(protected readonly repository: Repository<T>) {
//     super(repository);
//     // 自动获取实体的主键
//     this.primaryKey = this.repository.metadata.primaryColumns[0].propertyName;
//   }

//   // async create(createDto: any, req: Request) {
//   //   const entity = this.repository.create(createDto);
//   //   this.setCreateInfo(entity, req);
//   //   return this.repository.save(entity);
//   // }

// } 