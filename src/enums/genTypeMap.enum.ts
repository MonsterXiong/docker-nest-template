/**
 * 
 * @description
 * @example
 */
export enum GenFeEnum {
  /**
   * 页面
   */
  PAGE = 'page',
  ROUTE = 'route',
  CONFIG = 'config',
  STORE = 'global_store',
  BASE_SERVICE = 'base_service',
  EXTEND_SERVICE = 'extend_service',

  INTERFACE = 'interface',
  MODULE = 'module',
}

export enum GenBeEnum {
  CONTROLLER = 'controller',
  ENTITY = 'entity',
  MODULE = 'module',
  SERVICE = 'service',
  INTERFACE_ENTRY = 'interface_entry',
  MODULE_REGISTRY = 'module_registry',
  ENUM = 'enum',
  CONFIG = 'config',
  EXTEND_SERVICE = 'extend_service'
}

export const TYPE_MAP_SINGLE = {
  [GenFeEnum.PAGE]: false,
  [GenFeEnum.ROUTE]: false,
  [GenFeEnum.CONFIG]: true,
  [GenFeEnum.STORE]: false,
  [GenFeEnum.INTERFACE]: false,
  [GenFeEnum.MODULE]: true,
  [GenFeEnum.BASE_SERVICE]: false,
  [GenFeEnum.EXTEND_SERVICE]: false
}


export const TYPE_MAP_CODE = {
  [GenFeEnum.PAGE]: 'code',
  [GenFeEnum.ROUTE]: 'code',
  [GenFeEnum.CONFIG]: 'code',
  [GenFeEnum.INTERFACE]: 'tableName',
  [GenFeEnum.MODULE]: '',
  [GenFeEnum.BASE_SERVICE]: 'tableName',
  [GenFeEnum.EXTEND_SERVICE]: 'serviceName'
}

export enum MENUT_TYPE_ENUM  {
  MODULE = 'module',
  PAGE = 'page',
}