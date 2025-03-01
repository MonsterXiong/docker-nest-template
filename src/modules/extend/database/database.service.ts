import { Injectable, Logger } from '@nestjs/common';
import { Connection, createConnection } from 'mysql2/promise';
import { DatabaseConfigDto, TableConfig } from './dto/databaseConfig.dto';
import { ColumnDiff, IndexDiff, TableDiff } from './dto/tableDiff.dto';
import { DatabaseColumn, DatabaseIndex } from './dto/databaseConfig.dto';
import { ColumnPropertyDiffs, IndexPropertyDiffs } from './dto/tableDiff.dto';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  /**
   * 创建数据库连接
   */
  private async createConnection(config: DatabaseConfigDto): Promise<Connection> {
    try {
      return await createConnection({
        host: config.host,
        port: config.port,
        user: config.username,
        password: config.password,
      });
    } catch (error) {
      this.logger.error(`Failed to create database connection: ${error.message}`);
      throw error;
    }
  }

  /**
   * 确保数据库存在
   */
  private async ensureDatabase(connection: Connection, dbName: string): Promise<void> {
    try {
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
      await connection.query(`USE ${dbName}`);
    } catch (error) {
      this.logger.error(`Failed to ensure database exists: ${error.message}`);
      throw error;
    }
  }

  /**
   * 生成创建表的 SQL
   */
  private generateCreateTableSQL(table: TableConfig): string {
    const columnDefinitions = table.columns.map(column => {
      let sql = `\`${column.name}\` ${column.type}`;
      
      if (column.length) {
        sql += `(${column.length})`;
      }
      
      if (column.nullable === false) {
        sql += ' NOT NULL';
      }
      
      if (column.default !== undefined) {
        sql += ` DEFAULT ${column.default}`;
      }
      
      if (column.primary) {
        sql += ' PRIMARY KEY';
      }
      
      if (column.unique) {
        sql += ' UNIQUE';
      }
      
      if (column.comment) {
        sql += ` COMMENT '${column.comment}'`;
      }
      
      return sql;
    });

    let sql = `CREATE TABLE IF NOT EXISTS \`${table.name}\` (\n`;
    sql += columnDefinitions.join(',\n');

    if (table.indices?.length) {
      sql += ',\n' + table.indices.map(index => {
        return `${index.unique ? 'UNIQUE ' : ''}INDEX \`${index.name}\` (${index.columns.map(col => `\`${col}\``).join(', ')})`;
      }).join(',\n');
    }

    sql += '\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;';
    return sql;
  }

  /**
   * 检查表是否需要更新
   */
  private async checkTableUpdates(connection: Connection, table: TableConfig): Promise<boolean> {
    const [columns] = await connection.query(
      'SHOW COLUMNS FROM ??',
      [table.name]
    );
    
    // 比较现有列和新配置
    // 这里需要实现详细的比较逻辑
    return false; // 返回是否需要更新
  }

  /**
   * 根据 JSON 配置创建或更新数据库表
   */
  async generateTables(config: DatabaseConfigDto, tables: TableConfig[]): Promise<void> {
    let connection: Connection | null = null;
    
    try {
      // 创建连接
      connection = await this.createConnection(config);
      
      // 确保数据库存在
      await this.ensureDatabase(connection, config.database);
      
      // 处理每个表
      for (const table of tables) {
        try {
          // 检查表是否存在
          const [exists] = await connection.query(
            'SHOW TABLES LIKE ?',
            [table.name]
          );

          if (!exists[0]) {
            // 创建新表
            const createSQL = this.generateCreateTableSQL(table);
            await connection.query(createSQL);
            this.logger.log(`Created table: ${table.name}`);
          } else {
            // 检查是否需要更新
            const needsUpdate = await this.checkTableUpdates(connection, table);
            if (needsUpdate) {
              // 这里实现表更新逻辑
              this.logger.log(`Updated table: ${table.name}`);
            }
          }
        } catch (error) {
          this.logger.error(`Error processing table ${table.name}: ${error.message}`);
          throw error;
        }
      }
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }

  /**
   * 获取表的当前结构
   */
  private async getTableStructure(connection: Connection, tableName: string) {
    const [columns] = await connection.query<any[]>(
      'SHOW FULL COLUMNS FROM ??',
      [tableName]
    );

    const [indices] = await connection.query<any[]>(
      'SHOW INDEX FROM ??',
      [tableName]
    );

    return { columns, indices };
  }

  /**
   * 比较数据库表结构差异
   */
  async compareTables(config: DatabaseConfigDto, tables: TableConfig[]): Promise<TableDiff[]> {
    let connection: Connection | null = null;
    const differences: TableDiff[] = [];

    try {
      connection = await this.createConnection(config);
      await connection.query(`USE ${config.database}`);

      for (const table of tables) {
        const tableDiff: TableDiff = {
          name: table.name,
          exists: false,
          columns: [],
          indices: []
        };

        try {
          // 检查表是否存在
          const [exists] = await connection.query(
            'SHOW TABLES LIKE ?',
            [table.name]
          );

          if (!exists || !Array.isArray(exists) || exists.length === 0) {
            tableDiff.exists = false;
            // 如果表不存在，所有列和索引都标记为新增
            tableDiff.columns = table.columns.map(col => ({
              name: col.name,
              target: { ...col },
              status: 'add'
            }));
            tableDiff.indices = table.indices?.map(idx => ({
              name: idx.name,
              target: { ...idx },
              status: 'add'
            })) || [];
          } else {
            tableDiff.exists = true;
            const { columns, indices } = await this.getTableStructure(connection, table.name);

            // 比较列差异
            const currentColumns = new Map(columns.map(col => [col.Field, col]));
            const targetColumns = new Map(table.columns.map(col => [col.name, col]));

            // 检查新增和修改的列
            for (const [name, targetCol] of targetColumns) {
              const currentCol = currentColumns.get(name);
              if (!currentCol) {
                tableDiff.columns.push({
                  name,
                  target: targetCol,
                  status: 'add'
                });
              } else {
                // 比较列属性
                const { isDifferent, propertyDiffs } = this.compareColumnDefinitions(currentCol, targetCol);
                if (isDifferent) {
                  tableDiff.columns.push({
                    name,
                    current: this.formatCurrentColumn(currentCol),
                    target: targetCol,
                    status: 'modify',
                    propertyDiffs
                  });
                }
              }
            }

            // 检查删除的列
            for (const [name, currentCol] of currentColumns) {
              if (!targetColumns.has(name)) {
                tableDiff.columns.push({
                  name,
                  current: this.formatCurrentColumn(currentCol),
                  status: 'remove'
                });
              }
            }

            // 比较索引差异
            const currentIndices = new Map();
            indices.forEach(idx => {
              if (!currentIndices.has(idx.Key_name)) {
                currentIndices.set(idx.Key_name, {
                  name: idx.Key_name,
                  columns: [idx.Column_name],
                  unique: idx.Non_unique === 0
                });
              } else {
                currentIndices.get(idx.Key_name).columns.push(idx.Column_name);
              }
            });

            const targetIndices = new Map(table.indices?.map(idx => [idx.name, idx]) || []);

            // 检查新增和修改的索引
            for (const [name, targetIdx] of targetIndices) {
              const currentIdx = currentIndices.get(name);
              if (!currentIdx) {
                tableDiff.indices.push({
                  name,
                  target: targetIdx,
                  status: 'add'
                });
              } else {
                const { isDifferent, propertyDiffs } = this.compareIndexDefinitions(currentIdx, targetIdx);
                if (isDifferent) {
                  tableDiff.indices.push({
                    name,
                    current: currentIdx,
                    target: targetIdx,
                    status: 'modify',
                    propertyDiffs
                  });
                }
              }
            }

            // 检查删除的索引
            for (const [name, currentIdx] of currentIndices) {
              if (!targetIndices.has(name) && name !== 'PRIMARY') {
                tableDiff.indices.push({
                  name,
                  current: currentIdx,
                  status: 'remove'
                });
              }
            }
          }
        } catch (error) {
          this.logger.error(`Error comparing table ${table.name}: ${error.message}`);
          throw error;
        }

        differences.push(tableDiff);
      }

      return differences;
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }

  /**
   * 比较列定义并返回具体的差异
   */
  private compareColumnDefinitions(current: any, target: any): { isDifferent: boolean; propertyDiffs: ColumnPropertyDiffs } {
    const propertyDiffs: ColumnPropertyDiffs = {};
    
    // 比较类型
    const currentType = this.normalizeColumnType(current.Type);
    const targetType = this.normalizeColumnType(`${target.type}${target.length ? `(${target.length})` : ''}`);
    if (currentType !== targetType) {
      propertyDiffs.type = {
        current: current.Type,
        target: `${target.type}${target.length ? `(${target.length})` : ''}`,
        isDifferent: true
      };
    }

    // 比较是否可空
    const currentNullable = current.Null === 'YES';
    const targetNullable = target.nullable !== false;
    if (currentNullable !== targetNullable) {
      propertyDiffs.nullable = {
        current: currentNullable,
        target: targetNullable,
        isDifferent: true
      };
    }

    // 比较默认值
    if (current.Default !== target.default) {
      propertyDiffs.default = {
        current: current.Default,
        target: target.default,
        isDifferent: true
      };
    }

    // 比较主键
    const currentPrimary = current.Key === 'PRI';
    const targetPrimary = !!target.primary;
    if (currentPrimary !== targetPrimary) {
      propertyDiffs.primary = {
        current: currentPrimary,
        target: targetPrimary,
        isDifferent: true
      };
    }

    // 比较唯一约束
    const currentUnique = current.Key === 'UNI';
    const targetUnique = !!target.unique;
    if (currentUnique !== targetUnique) {
      propertyDiffs.unique = {
        current: currentUnique,
        target: targetUnique,
        isDifferent: true
      };
    }

    // 比较注释
    if (current.Comment !== target.comment) {
      propertyDiffs.comment = {
        current: current.Comment,
        target: target.comment,
        isDifferent: true
      };
    }

    return {
      isDifferent: Object.keys(propertyDiffs).length > 0,
      propertyDiffs
    };
  }

  /**
   * 比较索引定义并返回具体的差异
   */
  private compareIndexDefinitions(current: {
    columns: string[];
    unique: boolean;
  }, target: {
    columns: string[];
    unique?: boolean;
  }): { isDifferent: boolean; propertyDiffs: IndexPropertyDiffs } {
    const propertyDiffs: IndexPropertyDiffs = {};

    // 比较列
    if (!this.areArraysEqual(current.columns, target.columns)) {
      propertyDiffs.columns = {
        current: current.columns,
        target: target.columns,
        isDifferent: true
      };
    }

    // 比较唯一性
    if (current.unique !== !!target.unique) {
      propertyDiffs.unique = {
        current: current.unique,
        target: !!target.unique,
        isDifferent: true
      };
    }

    return {
      isDifferent: Object.keys(propertyDiffs).length > 0,
      propertyDiffs
    };
  }

  /**
   * 格式化当前列信息
   */
  private formatCurrentColumn(column: {
    Field: string;
    Type: string;
    Null: string;
    Key: string;
    Default: any;
    Comment: string;
  }) {
    const [type, length] = this.parseColumnType(column.Type);
    return {
      type,
      length,
      nullable: column.Null === 'YES',
      default: column.Default,
      primary: column.Key === 'PRI',
      unique: column.Key === 'UNI',
      comment: column.Comment
    };
  }

  /**
   * 标准化列类型
   */
  private normalizeColumnType(type: string): string {
    return type.toLowerCase().replace(/\s+/g, '');
  }

  /**
   * 解析列类型
   */
  private parseColumnType(type: string): [string, number?] {
    const match = type.match(/^(\w+)(?:\((\d+)\))?/);
    if (!match) return [type, undefined];
    return [match[1], match[2] ? parseInt(match[2], 10) : undefined];
  }

  /**
   * 比较数组是否相等
   */
  private areArraysEqual<T>(arr1: T[], arr2: T[]): boolean {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((item, index) => item === arr2[index]);
  }
}