import { SetMetadata } from "@nestjs/common";

export interface MethodParamInfo {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  defaultValue?: any;
}

export interface MethodOptions {
  name?: string;
  displayName?: string; // 中文显示名称
  description?: string;
  params?: MethodParamInfo[];
  returnType?: string;
  returnDescription?: string;
}

/**
 * 标记一个服务方法为可通过API调用
 * @param options 方法选项或方法名称
 */
export const Method = (options: string | MethodOptions = {}) => {
  const metadata = typeof options === 'string' 
    ? { name: options } 
    : options;
  
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const methodName = metadata.name || propertyKey;
    SetMetadata('method', methodName)(target, propertyKey, descriptor);
    SetMetadata('methodMetadata', metadata)(target, propertyKey, descriptor);
    return descriptor;
  };
};

/**
 * 为服务类添加中文显示名称
 */
export const ServiceMeta = (options: { displayName: string, description?: string }) => {
  return (target: any) => {
    SetMetadata('serviceMetadata', options)(target);
    return target;
  };
};