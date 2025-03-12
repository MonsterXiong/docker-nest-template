export class DatabaseConfigDto {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface TableColumnConfig {
  name: string;
  type: string;
  length?: number;
  nullable?: boolean;
  default?: any;
  primary?: boolean;
  unique?: boolean;
  comment?: string;
}

export interface TableConfig {
  name: string;
  columns: TableColumnConfig[];
  indices?: {
    name: string;
    columns: string[];
    unique?: boolean;
  }[];
} 

export interface DatabaseColumn {
  Field: string;
  Type: string;
  Null: string;
  Key: string;
  Default: any;
  Extra: string;
  Comment: string;
}

export interface DatabaseIndex {
  Table: string;
  Non_unique: number;
  Key_name: string;
  Seq_in_index: number;
  Column_name: string;
  Collation: string | null;
  Cardinality: number;
  Sub_part: number | null;
  Packed: string | null;
  Null: string;
  Index_type: string;
  Comment: string;
  Index_comment: string;
}