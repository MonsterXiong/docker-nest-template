import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { DatabaseConfigDto, TableSchemaDto } from '../../../shared/dto/database.dto';
import { GenUtil } from './gen.util';

@Injectable()
export class GenService {
  private readonly logger = new Logger(GenService.name);

  constructor(private readonly dbService: DbService) {}

  /**
   * 生成单个表的服务代码
   * @param tableName 表名
   * @param dbInfo 数据库配置信息
   */
  async getCurdServiceCode(tableName: string, dbInfo: DatabaseConfigDto): Promise<any> {
      this.logger.log(`开始生成表 ${tableName} 的代码`);
      const tableInfo = await this.dbService.getTable(dbInfo, tableName);
      if (!tableInfo) {
        throw new BadRequestException(`表 ${tableName} 不存在`);
      }
      return await GenUtil.renderCurdServiceCode(tableInfo);
  }

  /**
   * 批量生成多个表的服务代码
   * @param tableNames 表名列表
   * @param dbInfo 数据库配置信息
   */
  async getCurdServiceCodeBatch(tableNames: string[], dbInfo: DatabaseConfigDto): Promise<TableSchemaDto[]> {
      const tableInfoList = await this.dbService.getTableColumnsMultiple(dbInfo, tableNames);
      return await GenUtil.renderCurdServiceCodeList(tableInfoList);
  }

  /**
   * 生成所有表的服务代码
   * @param dbInfo 数据库配置信息 
   */
  async getCurdServiceCodeList(dbInfo: DatabaseConfigDto): Promise<any> {
      this.logger.log(`开始生成所有表的代码`);
      const tableInfoList = await this.dbService.getTableList(dbInfo);
      return await GenUtil.renderCurdServiceCodeList(tableInfoList);
  }


  
  /**
   * 生成单个表的服务代码
   * @param tableName 表名
   * @param dbInfo 数据库配置信息
   */
  async genCurdServiceCode(tableName: string, dbInfo: DatabaseConfigDto): Promise<any> {
    const fileInfo = await this.getCurdServiceCode(tableName, dbInfo);
    return await GenUtil.genCurdServiceCodeList(fileInfo);
  }

    /**
   * 批量生成多个表的服务代码
   * @param tableNames 表名列表
   * @param dbInfo 数据库配置信息
   */
    async genCurdServiceCodeBatch(tableNames: string[], dbInfo: DatabaseConfigDto): Promise<TableSchemaDto[]> {
      const tableInfoList = await this.getCurdServiceCodeBatch(tableNames,dbInfo,);
      return await GenUtil.genCurdServiceCodeList(tableInfoList);
  }

    /**
   * 生成所有表的服务代码
   * @param dbInfo 数据库配置信息 
   */
    async genCurdServiceCodeList(dbInfo: DatabaseConfigDto): Promise<any> {
      this.logger.log(`开始生成所有表的代码`);
      const tableInfoList = await this.getCurdServiceCodeList(dbInfo);
      return await GenUtil.genCurdServiceCodeList(tableInfoList);
  }

  async clearCurdServiceCodeList(): Promise<any> {
    this.logger.log(`开始清除所有表的代码`);
    return await GenUtil.clearCurdServiceCodeList();
  }
}


