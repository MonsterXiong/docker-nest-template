export function parseColumnType(fullType: string): { type: string; length?: number;sourceType:string, precision?: number; scale?: number } {
    const match = fullType.match(/^(\w+)(?:\(([^)]+)\))?/);
    if (!match) return { type: fullType,sourceType: fullType };

    const sourceType = match[1].toLowerCase();
    if (!match[2]) return { type: mapDbTypeToTsType(sourceType),sourceType };

    // 处理不同类型的参数
    const params = match[2].split(',').map(p => p.trim());
    if (sourceType.includes('decimal') || sourceType.includes('numeric')) {
      return {
        sourceType,
        type: 'number',
        precision: parseInt(params[0]), 
        scale: params[1] ? parseInt(params[1]) : 0
      };
    }
    
    return {
      sourceType,
      type: mapDbTypeToTsType(sourceType),
      length: parseInt(params[0])
    };
  }

  function mapDbTypeToTsType(dbType: string): string {
    const typeMap = {
      // 字符串类型
      varchar: 'string',
      char: 'string', 
      text: 'string',
      longtext: 'string',
      mediumtext: 'string',
      tinytext: 'string',

      // 数字类型
      int: 'number',
      tinyint: 'number',
      smallint: 'number',
      mediumint: 'number',
      bigint: 'number',
      float: 'number',
      double: 'number',
      decimal: 'number',

      // 日期时间类型
      datetime: 'Date',
      timestamp: 'Date',
      date: 'Date',
      time: 'Date',
      year: 'number',

      // 布尔类型
      boolean: 'boolean',
      bool: 'boolean',

      // 二进制类型
      blob: 'Buffer',
      longblob: 'Buffer',
      mediumblob: 'Buffer',
      tinyblob: 'Buffer',

      // JSON类型
      json: 'any'
    };

    return typeMap[dbType] || 'any';
  }