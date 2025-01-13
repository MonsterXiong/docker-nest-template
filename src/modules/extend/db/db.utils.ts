/**
 * 数据库工具类
 */
export class DbUtils {
  private static readonly TYPE_MAPPINGS = {
    // 字符串类型
    varchar: 'string',
    char: 'string',
    text: 'string',
    json: 'string',
    enum: 'string',
    
    // 数字类型
    int: 'number',
    decimal: 'number',
    float: 'number',
    double: 'number',
    
    // 日期时间类型
    datetime: 'Date',
    timestamp: 'Date',
    date: 'Date',
    time: 'Date',
    
    // 布尔类型
    bool: 'boolean',
    bit: 'boolean'
  } as const;

  private static readonly TYPEORM_MAPPINGS = {
    // 数字类型
    'tinyint(1)': 'boolean',
    tinyint: 'tinyint',
    smallint: 'smallint',
    mediumint: 'mediumint',
    int: 'int',
    bigint: 'bigint',
    decimal: 'decimal',
    float: 'float',
    double: 'double',
    
    // 字符串类型
    char: 'char',
    varchar: 'varchar',
    tinytext: 'tinytext',
    text: 'text',
    mediumtext: 'mediumtext',
    longtext: 'longtext',
    
    // 日期时间类型
    datetime: 'datetime',
    timestamp: 'timestamp',
    time: 'time',
    date: 'date',
    
    // 其他类型
    json: 'json',
    enum: 'enum',
    bit: 'bit'
  } as const;

  /**
   * 将MySQL数据类型转换为TypeScript类型
   * @param mysqlType MySQL数据类型
   * @returns TypeScript类型字符串
   */
  static convertMySQLTypeToTypeScript(mysqlType: string): string {
    const lowerType = mysqlType.toLowerCase();
    
    for (const [key, value] of Object.entries(DbUtils.TYPE_MAPPINGS)) {
      if (lowerType.includes(key)) {
        return value;
      }
    }
    
    return 'any';
  }

  /**
   * 获取TypeORM列类型
   * @param mysqlType MySQL数据类型
   * @returns TypeORM列类型字符串
   */
  static getTypeOrmColumnType(mysqlType: string): string {
    const lowerType = mysqlType.toLowerCase();
    
    // 特殊处理 tinyint(1)
    if (lowerType === 'tinyint(1)') {
      return DbUtils.TYPEORM_MAPPINGS['tinyint(1)'];
    }
    
    for (const [key, value] of Object.entries(DbUtils.TYPEORM_MAPPINGS)) {
      if (lowerType.startsWith(key)) {
        return value;
      }
    }
    
    return 'varchar';
  }

  /**
   * 解析列类型信息
   * @param fullType 完整的类型字符串
   * @returns 解析后的类型信息对象
   */
  static parseColumnType(fullType: string): {
    type: string;
    length?: number;
    precision?: number;
    scale?: number;
  } {
    const match = fullType.match(/^(\w+)(?:\(([^)]+)\))?/);
    if (!match) {
      return { type: fullType };
    }

    const type = match[1].toLowerCase();
    if (!match[2]) {
      return { type };
    }

    const params = match[2].split(',').map(p => p.trim());
    
    // 处理 decimal 和 numeric 类型
    if (type === 'decimal' || type === 'numeric') {
      return {
        type,
        precision: parseInt(params[0], 10),
        scale: params[1] ? parseInt(params[1], 10) : 0
      };
    }
    
    return {
      type,
      length: parseInt(params[0], 10)
    };
  }

  /**
   * 获取列选项配置
   * @param column 列信息
   * @returns 列选项配置对象
   */
  static getColumnOptions(column: any): Record<string, any> {
    const options: Record<string, any> = {};
    const typeInfo = DbUtils.parseColumnType(column.Type);

    // 设置主键
    if (column.Key === 'PRI') {
      options.primary = true;
      if (column.Extra.includes('auto_increment')) {
        options.generated = true;
      }
    }

    // 设置可空性
    options.nullable = column.Null === 'YES';

    // 设置默认值
    if (column.Default !== null) {
      options.default = column.Default === 'CURRENT_TIMESTAMP' 
        ? () => 'CURRENT_TIMESTAMP'
        : column.Default;
    }

    // 设置长度/精度
    if (typeInfo.length) {
      options.length = typeInfo.length;
    }
    if (typeInfo.precision) {
      options.precision = typeInfo.precision;
      options.scale = typeInfo.scale;
    }

    // 设置注释
    if (column.Comment) {
      options.comment = column.Comment;
    }

    // 设置唯一约束
    if (column.Key === 'UNI') {
      options.unique = true;
    }

    return options;
  }
} 