/**
 * 代码生成类型枚举
 * 
 * @description
 * 用于标识不同类型的代码生成
 */
export enum GenTypeMapEnum {
  /** 页面代码 */
  PAGE = 'page',
  /** 路由配置 */
  ROUTE = 'route',
  /** 环境配置 */
  CONFIG = 'config',
  /** 基础服务 */
  BASE_SERVICE = 'base_service',
  /** 扩展服务 */
  EXTEND_SERVICE = 'extend_service',
  /** 接口定义 */
  INTERFACE = 'interface',
  /** 模块文件 */
  MODULE = 'module',
}
/**
 * 代码生成配置接口
 */
export interface GenTypeConfig {
  /** 是否为单文件模式 */
  isSingle: boolean;
  /** 代码字段名称 */
  codeKey: string;
}

/**
 * 代码生成类型配置映射
 */
export const GEN_TYPE_CONFIG: Record<GenTypeMapEnum, GenTypeConfig> = {
  [GenTypeMapEnum.PAGE]: { isSingle: false, codeKey: 'code' },
  [GenTypeMapEnum.ROUTE]: { isSingle: false, codeKey: 'code' },
  [GenTypeMapEnum.CONFIG]: { isSingle: true, codeKey: 'code' },
  [GenTypeMapEnum.INTERFACE]: { isSingle: false, codeKey: 'tableName' },
  [GenTypeMapEnum.MODULE]: { isSingle: true, codeKey: '' },
  [GenTypeMapEnum.BASE_SERVICE]: { isSingle: false, codeKey: 'tableName' },
  [GenTypeMapEnum.EXTEND_SERVICE]: { isSingle: false, codeKey: 'serviceName' }
};

// export const TYPE_MAP_SINGLE = {
//   [GenTypeMapEnum.PAGE]: false,
//   [GenTypeMapEnum.ROUTE]: false,
//   [GenTypeMapEnum.CONFIG]: true,
//   [GenTypeMapEnum.INTERFACE]: false,
//   [GenTypeMapEnum.MODULE]: true,
//   [GenTypeMapEnum.BASE_SERVICE]: false,
//   [GenTypeMapEnum.EXTEND_SERVICE]: false
// }


// export const TYPE_MAP_CODE = {
//   [GenTypeMapEnum.PAGE]: 'code',
//   [GenTypeMapEnum.ROUTE]: 'code',
//   [GenTypeMapEnum.CONFIG]: 'code',
//   [GenTypeMapEnum.INTERFACE]: 'tableName',
//   [GenTypeMapEnum.MODULE]: '',
//   [GenTypeMapEnum.BASE_SERVICE]: 'tableName',
//   [GenTypeMapEnum.EXTEND_SERVICE]: 'serviceName'
// }