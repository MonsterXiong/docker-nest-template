import { ColumnInfo, GenColumnInfo, TableSchema } from '../../../interfaces/db.interface';
import { TableSchemaDto, ColumnSchemaDto } from '../../../shared/dto/database.dto';
import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';
import {ensureDirSync} from 'fs-extra'
import { 
  camelCase, 
  pascalCase, 
  snakeCase, 
} from 'change-case';

export interface EjsTemplateData {
  TableName: string;      // 帕斯卡命名（如：UserInfo）
  tableName: string;      // 驼峰命名（如：userInfo）
  table_name: string;     // 蛇形命名（如：user_info）
  tableComment: string;   // 表注释
  ApiPrefix: string;      // API前缀
  primaryKey: string;     // 主键字段名
  fields: Array<{
    columnName:string,
    type,
    length,
    nullable: boolean,
    isPrimary: boolean,
    comment: string,
    default?: string,
    columnOptions:ColumnSchemaDto
  }>;
}

export class GenUtil {
  constructor(){}
  private static parseColumnType(fullType: string): { type: string; length?: number; precision?: number; scale?: number } {
    const match = fullType.match(/^(\w+)(?:\(([^)]+)\))?/);
    if (!match) return { type: fullType };

    const type = match[1].toLowerCase();
    if (!match[2]) return { type: this.mapDbTypeToTsType(type) };

    // 处理不同类型的参数
    const params = match[2].split(',').map(p => p.trim());
    if (type.includes('decimal') || type.includes('numeric')) {
      return {
        type: 'number',
        precision: parseInt(params[0]), 
        scale: params[1] ? parseInt(params[1]) : 0
      };
    }
    
    return {
      type: this.mapDbTypeToTsType(type),
      length: parseInt(params[0])
    };
  }

  private static mapDbTypeToTsType(dbType: string): string {
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

  /**
   * 确保目录存在
   */
  static ensureDirectoryExistence(filePath: string): void {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return;
    }
    this.ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }

  /**
   * 写入生成的文件
   */
  static async writeGeneratedFile(filePath: string, content: string): Promise<void> {
    try {
      this.ensureDirectoryExistence(filePath);
      return await fs.promises.writeFile(filePath, content, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write file ${filePath}: ${error.message}`);
    }
  }

  static async getTemplate(){
    const files = [
      { name: 'entity'},
      { name: 'service'}, 
      { name: 'controller'},
      { name: 'module'},
      { name: 'index'},
    ];
    return files.map(file => {
      const templateStr = fs.readFileSync(path.resolve(__dirname, 'template', `${file.name}.ejs`), 'utf8');
      const renderTemplate = ejs.compile(templateStr);
      return {
        renderTemplate,
        name: file.name,
        fileExt: `.${file.name}.ts`
      };
    })
  }

  static async renderCurdServiceCodeList(tableInfoList: TableSchemaDto[]): Promise<any[]> {
    return (await Promise.all(tableInfoList.map(tableInfo => this.renderCurdServiceCode(tableInfo)))).flat()
  }
  /**
   * 生成完整的代码文件
   */
  static async renderCurdServiceCode(tableInfo: TableSchemaDto): Promise<any[]> {
    const templateData = this.convertEjsTemplateData(tableInfo);
    const templateList = await this.getTemplate()
    return templateList.map(item => {
      const filename = templateData.tableName
      return {
        filepath:item.name == 'index'?`${filename}/${item.name}.ts`:`${filename}/${filename}${item.fileExt}`,
        content:item.renderTemplate(templateData)
      }
    })
  }

  /**
   * 将DTO转换为内部使用的TableSchema
   */
  static convertEjsTemplateData(tableInfo: TableSchemaDto): EjsTemplateData {
    const tableName = camelCase(tableInfo.tableName);
    const TableName = pascalCase(tableInfo.tableName);
    const primaryKeyField = tableInfo.columns.find(col => col.Key == 'PRI');
    return {
      tableName,
      TableName,
      table_name: snakeCase(tableInfo.tableName),
      tableComment: tableInfo.comment,
      ApiPrefix: 'api',
      primaryKey: primaryKeyField ? camelCase(primaryKeyField.Field) : 'id',
      fields: tableInfo.columns?.map(col => {
        const {type, length} = this.parseColumnType(col.Type);
        return {
          columnName:camelCase(col.Field),
          type,
          length,
          nullable: col.Null == 'YES',
          isPrimary: col.Key == 'PRI',
          comment: col.Comment,
          default: col.Default,
          columnOptions:col
        };
      })
      
    };
  }


  static getBaseServiceDir(){
    return path.resolve(process.cwd(), "src/modules/base")
  }
  static getFilePath(fileInfo: any){
    return path.join(this.getBaseServiceDir(), fileInfo.filepath);
  }
  static async genCurdServiceCode(fileInfo: any): Promise<any> {
    return await this.writeGeneratedFile(this.getFilePath(fileInfo), fileInfo.content);
  }

  static async genCurdServiceCodeList(fileInfoList: any[]): Promise<any> {
    try {
      await Promise.all(fileInfoList.map(fileInfo=>this.genCurdServiceCode(fileInfo)));
      const moduleScanner = new ModuleScanner();
      await moduleScanner.scanAndUpdateModules();
      return {
        message: '生成成功'
      }
    } catch (error) {
      throw new Error(`代码生成失败: ${error.message}`);
    }
  }
  static async clearCurdServiceCodeList(){
    await fs.promises.rmdir(this.getBaseServiceDir(),{recursive:true});
    const moduleScanner = new ModuleScanner();
    await moduleScanner.scanAndUpdateModules();
    return {
      message: '清除成功'
    }
  }
}

export class ModuleScanner {
  private indexPath: string;
  private baseModulesPath: string;

  constructor() {
    path.resolve(process.cwd(), "src/modules/base")
    this.baseModulesPath = GenUtil.getBaseServiceDir()
    this.indexPath = path.resolve(this.baseModulesPath, '../index.ts');
  }

  /**
   * 扫描并更新模块
   */
  public async scanAndUpdateModules(): Promise<void> {
    try {
      const moduleNames = await this.scanBaseModules();
      await this.updateIndexFile(moduleNames);
    } catch (error) {
      console.error('更新模块失败:', error);
      throw error;
    }
  }

  /**
   * 扫描base目录下的所有模块
   */
  private async scanBaseModules(): Promise<string[]> {
    try {
      ensureDirSync(this.baseModulesPath)
      return await fs.promises.readdir(this.baseModulesPath);
    } catch (error) {
      console.error('扫描模块目录失败:', error);
      throw error;
    }
  }

  /**
   * 更新index.ts文件
   */
  private async updateIndexFile(moduleNames: string[]): Promise<void> {
    const exportModuleNames = []
    const importStatements = []
    // 创建导入语句

    moduleNames.forEach(moduleName=>{
      const exportModuleName = `${pascalCase(moduleName)}Module`;
      // const importFileName = `./base/${camelCase(moduleName)}/${camelCase(moduleName)}.module`;
      const importFileName = `./base/${camelCase(moduleName)}`;
      exportModuleNames.push(exportModuleName);
      importStatements.push(`import { ${exportModuleName} } from '${importFileName}';`)
    })
    // 创建导出数组
    const exportArray = `export default [\n  ${exportModuleNames.join(',\n  ')}\n];`;

    // 组合完整的文件内容
    const fileContent = `${importStatements.join('\n')}\n\n${exportArray}\n`;

    try {
      if (fs.existsSync(this.indexPath)) {
        await fs.promises.writeFile(this.indexPath, fileContent, 'utf-8');
      }
    } catch (error) {
      console.error('更新索引文件失败:', error);
      throw error;
    }
  }
} 
