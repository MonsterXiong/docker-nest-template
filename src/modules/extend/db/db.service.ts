import { Injectable, OnModuleInit, OnModuleDestroy, HttpException, HttpStatus } from '@nestjs/common';
import { createPool, Pool, PoolConnection, RowDataPacket } from 'mysql2/promise';
import { DatabaseConfigDto, TableSchemaDto, ColumnSchemaDto } from '../../../shared/dto/database.dto';
import { ColumnInfo } from '../../../interfaces/db.interface';
import { DbUtils } from './db.utils';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private pools: Map<string, Pool> = new Map();

  // 初始化连接池
  private async createPool(config: DatabaseConfigDto): Promise<Pool> {
    const key = this.getDatabaseKey(config);
    if (this.pools.has(key)) {
      return this.pools.get(key);
    }

    const pool = createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    this.pools.set(key, pool);
    return pool;
  }

  // 生成数据库连接的唯一键
  private getDatabaseKey(config: DatabaseConfigDto): string {
    return `${config.host}:${config.port}:${config.database}`;
  }

  // 获取连接
  private async getConnection(config: DatabaseConfigDto): Promise<PoolConnection> {
    const pool = await this.createPool(config);
    return await pool.getConnection();
  }

  // 执行数据库操作的通用方法
  private async executeQuery<T>(
    config: DatabaseConfigDto, 
    operation: (connection: PoolConnection) => Promise<T>
  ): Promise<T> {
    const connection = await this.getConnection(config);
    try {
      return await operation(connection);
    } finally {
      connection.release();
    }
  }

  // 获取表的基本信息
  private async queryTableBaseInfo(
    connection: PoolConnection,
    database: string,
    tableName?: string
  ): Promise<TableSchemaDto[]> {
    const query = `
      SELECT 
        TABLE_NAME as tableName,
        TABLE_TYPE as tableType,
        ENGINE as engine,
        TABLE_COMMENT as comment
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ?
      ${tableName ? 'AND TABLE_NAME = ?' : ''}
    `;
    const params = tableName ? [database, tableName] : [database];
    const [tables] = await connection.query<(RowDataPacket & TableSchemaDto)[]>(query, params);
    return tables;
  }

  // 获取表的列信息
  private async queryTableColumns(
    connection: PoolConnection,
    database: string,
    tableName: string
  ): Promise<ColumnSchemaDto[]> {
    const [columns] = await connection.query<(RowDataPacket & ColumnInfo)[]>(
      `SHOW FULL COLUMNS FROM \`${database}\`.\`${tableName}\``
    );
    
    return columns;
  }

  // 获取完整的表结构信息
  private async getTableStructure(
    connection: PoolConnection,
    database: string,
    tableName: string
  ): Promise<TableSchemaDto> {
    const [tableInfo] = await this.queryTableBaseInfo(connection, database, tableName);
    if (!tableInfo) {
      throw new HttpException(
        `Table ${tableName} not found in database ${database}`,
        HttpStatus.NOT_FOUND
      );
    }
    
    const columns = await this.queryTableColumns(connection, database, tableName);
    return { ...tableInfo, columns };
  }

  // 公共 API 方法
  async getAllTables(config: DatabaseConfigDto): Promise<TableSchemaDto[]> {
    return this.executeQuery(config, (connection) => 
      this.queryTableBaseInfo(connection, config.database)
    );
  }

  async getTableNames(config: DatabaseConfigDto): Promise<string[]> {
    const tables = await this.getAllTables(config);
    return tables.map(table => table.tableName);
  }

  async getTableList(config: DatabaseConfigDto): Promise<TableSchemaDto[]> {
    return this.executeQuery(config, async (connection) => {
      const tables = await this.queryTableBaseInfo(connection, config.database);
      return Promise.all(
        tables.map(table => 
          this.getTableStructure(connection, config.database, table.tableName)
        )
      );
    });
  }

  async getTable(config: DatabaseConfigDto, tableName: string): Promise<TableSchemaDto> {
    return this.executeQuery(config, (connection) =>
      this.getTableStructure(connection, config.database, tableName)
    );
  }

  async getTableColumnsMultiple(
    config: DatabaseConfigDto, 
    tableNames: string[]
  ): Promise<TableSchemaDto[]> {
    return this.executeQuery(config, async (connection) => {
      return Promise.all(
        tableNames.map(tableName =>
          this.getTableStructure(connection, config.database, tableName)
        )
      );
    });
  }

  // 生命周期方法
  async onModuleInit() {
    // 初始化时的处理逻辑
  }

  async onModuleDestroy() {
    for (const pool of this.pools.values()) {
      await pool.end();
    }
    this.pools.clear();
  }
}