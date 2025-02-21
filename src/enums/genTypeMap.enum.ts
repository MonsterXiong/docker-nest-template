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
    
    /**
     * 路由
     */
    ROUTE = 'route',
    /**
     * 路由
     */
    CONFIG = 'config',
    /**
     * 路由
     */
    INTERFACE = 'interface',
    /**
     * 路由
     */
    MODULE = 'module',
    /**
     * 路由
     */
    BASE_SERVICE = 'base_service',
    /**
     * 路由
     */
    EXTEND_SERVICE = 'extend_service',
  } 

  
export  const TYPE_MAP_SINGLE = {
    PAGE:false,
    ROUTE:false,
    CONFIG:true,
    INTERFACE:false,
    MODULE:true,
    BASE_SERVICE:false,
    EXTEND_SERVICE:false
  }