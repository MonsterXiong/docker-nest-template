/**
 * 预览状态枚举
 * 
 * @description
 * 用于标识导航项是否为演示项目
 * 
 * @example
 * const status = PreviewStatus.ACTIVE; // 表示非演示项目
 * const status = PreviewStatus.DEMO;   // 表示演示项目
 */
export enum GenTypeMapEnum {
  /**
   * 页面
   */
  PAGE = 'page',
  ROUTE = 'route',
  CONFIG = 'config',
  BASE_SERVICE = 'base_service',
  EXTEND_SERVICE = 'extend_service',

  INTERFACE = 'interface',
  MODULE = 'module',
}


export const TYPE_MAP_SINGLE = {
  [GenTypeMapEnum.PAGE]: false,
  [GenTypeMapEnum.ROUTE]: false,
  [GenTypeMapEnum.CONFIG]: true,
  [GenTypeMapEnum.INTERFACE]: false,
  [GenTypeMapEnum.MODULE]: true,
  [GenTypeMapEnum.BASE_SERVICE]: false,
  [GenTypeMapEnum.EXTEND_SERVICE]: false
}


export const TYPE_MAP_CODE = {
  [GenTypeMapEnum.PAGE]: 'code',
  [GenTypeMapEnum.ROUTE]: 'code',
  [GenTypeMapEnum.CONFIG]: 'code',
  [GenTypeMapEnum.INTERFACE]: 'tableName',
  [GenTypeMapEnum.MODULE]: '',
  [GenTypeMapEnum.BASE_SERVICE]: 'tableName',
  [GenTypeMapEnum.EXTEND_SERVICE]: 'serviceName'
}