import * as changeCase from 'change-case';
import path from 'path';
import { GenTypeMapEnum, GEN_TYPE_CONFIG } from 'src/enums/genTypeMap.enum';
/**
 * 代码生成项目结构
 */
export interface CodeItem {
    filePath: string;
    fileExt?: string;
    code: string;
    children?: CodeItem[];
    [key: string]: any;
  }

  /**
 * 格式化后的文件结构
 */
export interface FormattedFile {
    content: string;
    filePath: string;
  }

  /**
 * 格式化代码生成数据
 * @param data 代码生成数据
 * @param genType 生成类型
 * @returns 格式化后的文件列表
 */
export function formatByType(
    data: CodeItem[], 
    genType: GenTypeMapEnum
  ): FormattedFile[] {
    const config = GEN_TYPE_CONFIG[genType];
    if (!config) {
      console.error(`未知的生成类型: ${genType}`);
      return [];
    }
    
    return format(data, config.isSingle, config.codeKey);
  }
/**
 * 格式化代码生成数据
 * @param data 代码生成数据
 * @param isSingle 是否为单文件模式
 * @param codeKey 代码字段名称
 * @returns 格式化后的文件列表
 */
export function format(
    data: CodeItem[], 
    isSingle: boolean, 
    codeKey: string = 'code'
  ): FormattedFile[] {
    if (!data || !Array.isArray(data)) {
      return [];
    }
  
    const result: FormattedFile[] = [];
  
    data.forEach(item => {
      try {
        if (isSingle) {
          // 单文件模式：直接处理当前项
          if (item && item[codeKey]) {
            result.push(formatData(item, item[codeKey]));
          }
        } else {
          // 多文件模式：处理子项
          if (item?.children?.length) {
            item.children.forEach(childItem => {
              if (childItem && item[codeKey]) {
                result.push(formatData(childItem, item[codeKey]));
              }
            });
          }
        }
      } catch (error) {
        console.error('Error formatting code item:', error);
      }
    });
  
    return result;
  }
/**
 * 格式化单个数据项
 * @param item 数据项
 * @param name 名称
 * @returns 格式化后的文件
 */
function formatData(item: CodeItem, name: string): FormattedFile {
    const Code = name ? changeCase.pascalCase(name) : '';
    const code = name ? changeCase.camelCase(name) : '';
    
    // 替换路径中的占位符
    let filePath = item.filePath.replaceAll('{Code}', Code).replaceAll('{code}', code);
    
    // 添加文件扩展名
    if (item.fileExt) {
      filePath += `.${item.fileExt}`;
    }
    
    return {
      content: item.code,
      filePath: path.join(filePath)
    };
  }