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
export enum PreviewStatus {
  /**
   * 非演示项目
   */
  ACTIVE = '0',
  
  /**
   * 演示项目
   */
  DEMO = '1'
} 