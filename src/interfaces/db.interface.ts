import { ColumnSchemaDto } from "src/shared/dto/database.dto";

/**
 * 数据库列信息接口（原始MySQL信息）
 */
export interface ColumnInfo {
  Field: string;
  Type: string;
  Collation: string | null;
  Null: string;
  Key: string;
  Default: any;
  Extra: string;
  Privileges: string;
  Comment: string;
}

/**
 * 数据库表结构接口（原始MySQL信息）
 */
export interface TableSchema {
  tableName: string;
  tableType?: string;
  engine?: string;
  comment?: string;
  columns: ColumnInfo[];
}

/**
 * 代码生成使用的列信息接口
 */
export interface GenColumnInfo extends ColumnInfo {
  name?: string;
  type?: string;
  nullable?: boolean;
  isPrimary?: boolean;
  comment?: string;
  default?: any;
  length?: number;
  columnOptions?: ColumnSchemaDto;
}

/**
 * 代码生成使用的表结构接口
 */
export interface GenTableSchema {
  tableName: string;
  comment?: string;
  columns: GenColumnInfo[];
}