import { Controller, Get, Inject, Param, Post, Body, Query } from '@nestjs/common';
import { Reflector, ModuleRef } from '@nestjs/core';
import { Method, ServiceMeta } from './decorators/method.decorators';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

interface ServiceInfo {
  name: string;
  displayName: string;
  description?: string;
}

interface MethodInfo {
  name: string;
  displayName?: string;
  description?: string;
  params?: any[];
  returnType?: string;
  returnDescription?: string;
}

@ApiTags('服务调用')
@Controller('services')
export class ServiceController {
  private serviceRegistry: Map<string, any> = new Map();
  private serviceMetadata: Map<string, ServiceInfo> = new Map();

  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef
  ) {
    // 在构造函数中初始化服务注册表
    this.initializeServiceRegistry();
  }

  @Get()
  @Method({ displayName: '获取所有服务', description: '返回系统中所有可用的服务列表' })
  @ApiOperation({ summary: '获取所有服务', description: '返回系统中所有可用的服务列表' })
  @ApiResponse({ 
    status: 200, 
    description: '服务列表',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'menu' },
          displayName: { type: 'string', example: '菜单服务' },
          description: { type: 'string', example: '提供菜单相关的操作和数据查询' }
        }
      }
    }
  })
  getServices(): ServiceInfo[] {
    const services: ServiceInfo[] = [];
    
    for (const [name, service] of this.serviceRegistry.entries()) {
      const metadata = this.serviceMetadata.get(name) || { name, displayName: name };
      services.push(metadata);
    }
    
    return services;
  }

  @Get(':serviceName/methods')
  @Method({ displayName: '获取服务方法', description: '返回指定服务的所有可用方法' })
  @ApiOperation({ summary: '获取服务方法', description: '返回指定服务的所有可用方法' })
  @ApiParam({ name: 'serviceName', description: '服务名称', example: 'menu' })
  @ApiResponse({ 
    status: 200, 
    description: '方法列表',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'getMenuRelData' },
          displayName: { type: 'string', example: '获取菜单关联数据' },
          description: { type: 'string', example: '获取菜单及其关联的权限、角色等数据' },
          params: { 
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                type: { type: 'string' },
                description: { type: 'string' },
                required: { type: 'boolean' }
              }
            }
          },
          returnType: { type: 'string' },
          returnDescription: { type: 'string' }
        }
      }
    }
  })
  getMethodsByService(@Param('serviceName') serviceName: string): MethodInfo[] {
    const service = this.serviceRegistry.get(serviceName);
    
    if (!service) {
      return [];
    }
    
    return this.getExposedMethodsWithMetadata(service);
  }

  @Post(':serviceName/:methodName')
  @Method({ displayName: '调用服务方法', description: '调用指定服务的指定方法，并传递参数' })
  @ApiOperation({ summary: '调用服务方法', description: '调用指定服务的指定方法，并传递参数' })
  @ApiParam({ name: 'serviceName', description: '服务名称', example: 'project' })
  @ApiParam({ name: 'methodName', description: '方法名称', example: 'getProjects' })
  @ApiBody({ 
    description: '方法参数 (可以是对象或数组)',
    schema: {
      oneOf: [
        {
          type: 'object',
          example: { status: 'active' }
        },
        {
          type: 'array',
          example: ['active']
        }
      ]
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: '方法执行结果',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { type: 'object' },
        error: { type: 'string' },
        stack: { type: 'string' }
      }
    }
  })
  async invokeMethodWithParams(
    @Param('serviceName') serviceName: string,
    @Param('methodName') methodName: string,
    @Body() params: any
  ) {
    return this.executeServiceMethod(serviceName, methodName, params);
  }

  @Get(':serviceName/:methodName')
  @Method({ displayName: '调用无参数服务方法', description: '调用指定服务的指定方法（无参数）' })
  @ApiOperation({ summary: '调用无参数服务方法', description: '调用指定服务的指定方法（无参数）' })
  @ApiParam({ name: 'serviceName', description: '服务名称', example: 'menu' })
  @ApiParam({ name: 'methodName', description: '方法名称', example: 'getMenuRelData' })
  @ApiResponse({ 
    status: 200, 
    description: '方法执行结果',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { type: 'object' },
        error: { type: 'string' },
        stack: { type: 'string' }
      }
    }
  })
  async invokeMethod(
    @Param('serviceName') serviceName: string,
    @Param('methodName') methodName: string
  ) {
    return this.executeServiceMethod(serviceName, methodName);
  }

  @Get('registry')
  @Method({ displayName: '获取服务注册表', description: '返回所有服务及其方法的完整注册表' })
  @ApiOperation({ summary: '获取服务注册表', description: '返回所有服务及其方法的完整注册表' })
  @ApiResponse({ 
    status: 200, 
    description: '服务注册表',
    schema: {
      type: 'object',
      properties: {
        services: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              displayName: { type: 'string' },
              description: { type: 'string' }
            }
          }
        },
        methodsByService: {
          type: 'object',
          additionalProperties: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                displayName: { type: 'string' },
                description: { type: 'string' },
                params: { type: 'array' },
                returnType: { type: 'string' },
                returnDescription: { type: 'string' }
              }
            }
          }
        }
      }
    }
  })
  getServiceRegistry(): { services: ServiceInfo[], methodsByService: Record<string, MethodInfo[]> } {
    const services: ServiceInfo[] = [];
    const methodsByService: Record<string, MethodInfo[]> = {};
    
    for (const [name, service] of this.serviceRegistry.entries()) {
      const metadata = this.serviceMetadata.get(name) || { name, displayName: name };
      services.push(metadata);
      methodsByService[name] = this.getExposedMethodsWithMetadata(service);
    }
    
    return { services, methodsByService };
  }

  // 添加一个新的端点，用于获取方法的参数信息
  @Get(':serviceName/:methodName/params')
  @Method({ displayName: '获取方法参数信息', description: '获取指定服务方法的参数信息' })
  @ApiOperation({ summary: '获取方法参数信息', description: '获取指定服务方法的参数信息' })
  @ApiParam({ name: 'serviceName', description: '服务名称', example: 'project' })
  @ApiParam({ name: 'methodName', description: '方法名称', example: 'getProjectById' })
  @ApiResponse({ 
    status: 200, 
    description: '参数信息',
    schema: {
      type: 'object',
      properties: {
        params: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              type: { type: 'string' },
              description: { type: 'string' },
              required: { type: 'boolean' },
              defaultValue: { type: 'string' }
            }
          }
        },
        example: { type: 'object' }
      }
    }
  })
  getMethodParams(
    @Param('serviceName') serviceName: string,
    @Param('methodName') methodName: string
  ): { params: any[], example: any } {
    const service = this.serviceRegistry.get(serviceName);
    
    if (!service) {
      return { params: [], example: {} };
    }
    
    const method = service[methodName];
    if (!method || typeof method !== 'function') {
      return { params: [], example: {} };
    }
    
    const metadata = this.reflector.get('methodMetadata', method) || {};
    const params = metadata.params || [];
    
    // 构建示例对象
    const example: any = {};
    params.forEach((param: any) => {
      if (param.name) {
        // 根据类型提供示例值
        switch (param.type) {
          case 'string':
            example[param.name] = '示例字符串';
            break;
          case 'number':
            example[param.name] = 1;
            break;
          case 'boolean':
            example[param.name] = true;
            break;
          case 'object':
            example[param.name] = { key: 'value' };
            break;
          case 'array':
            example[param.name] = [1, 2, 3];
            break;
          default:
            example[param.name] = null;
        }
      }
    });
    
    return { params, example };
  }

  private async initializeServiceRegistry(): Promise<void> {
    // 延迟初始化，确保所有模块都已加载
    const timer = setTimeout(() => {
      try {
        // 扫描所有以Service结尾的提供者
        const moduleContainer = (this.moduleRef as any)['container'];
        if (!moduleContainer) return;
        
        const modules = moduleContainer.getModules();
        
        for (const [_, module] of modules.entries()) {
          const providers = module.providers;
          
          if (providers) {
            for (const [providerToken, providerRef] of providers.entries()) {
              let serviceName = null;
              
              // 处理类引用的token
              if (typeof providerToken === 'function') {
                const name = providerToken.name;
                if (name.endsWith('Service')) {
                  serviceName = name.replace(/Service$/, '');
                  
                  // 获取服务元数据
                  const serviceMetadata = this.reflector.get('serviceMetadata', providerToken);
                  if (serviceMetadata) {
                    this.serviceMetadata.set(serviceName, {
                      name: serviceName,
                      displayName: serviceMetadata.displayName || serviceName,
                      description: serviceMetadata.description
                    });
                  }
                }
              } 
              // 处理字符串token
              else if (typeof providerToken === 'string' && providerToken.endsWith('Service')) {
                serviceName = providerToken.replace(/Service$/, '');
              }
              
              // 如果找到了服务名称并且实例存在，则添加到注册表
              if (serviceName && providerRef.instance) {
                this.serviceRegistry.set(serviceName, providerRef.instance);
                
                // 如果没有元数据，添加默认元数据
                if (!this.serviceMetadata.has(serviceName)) {
                  this.serviceMetadata.set(serviceName, {
                    name: serviceName,
                    displayName: serviceName
                  });
                }
              }
            }
          }
        }
        console.log(`Service registry initialized with ${this.serviceRegistry.size} services`);
        clearTimeout(timer);
      } catch (error) {
        console.error('Failed to initialize service registry:', error);
      }
    }, 1000);
  }

  private getExposedMethodsWithMetadata(service: any): MethodInfo[] {
    if (!service) return [];
    
    const methods: MethodInfo[] = [];
    
    Object.getOwnPropertyNames(Object.getPrototypeOf(service))
      .forEach(prop => {
        // 排除构造函数和私有方法
        if (prop === 'constructor' || prop.startsWith('_')) return;
        
        const method = service[prop];
        if (typeof method !== 'function') return;
        
        // 检查是否有Method装饰器
        const methodName = this.reflector.get<string>('method', method);
        if (!methodName) return;
        
        // 获取方法元数据
        const metadata = this.reflector.get('methodMetadata', method) || {};
        
        methods.push({
          name: methodName,
          displayName: metadata.displayName || methodName,
          description: metadata.description,
          params: metadata.params || [],
          returnType: metadata.returnType,
          returnDescription: metadata.returnDescription
        });
      });
    
    return methods;
  }

  private getExposedMethods(service: any): string[] {
    if (!service) return [];
    
    return Object.getOwnPropertyNames(Object.getPrototypeOf(service))
      .filter(prop => {
        // 排除构造函数和私有方法
        if (prop === 'constructor' || prop.startsWith('_')) return false;
        
        const method = service[prop];
        if (typeof method !== 'function') return false;
        
        // 检查是否有Method装饰器
        const methodName = this.reflector.get<string>('method', method);
        return !!methodName;
      });
  }

  private async executeServiceMethod(
    serviceName: string, 
    methodName: string, 
    params?: any
  ): Promise<any> {
    // 从注册表中获取服务实例
    const serviceInstance = this.serviceRegistry.get(serviceName);
    
    if (!serviceInstance) {
      return {
        success: false,
        error: `Service ${serviceName} not found`
      };
    }

    // 检查方法是否存在并使用装饰器标记
    const method = serviceInstance[methodName];
    if (!method || typeof method !== 'function') {
      return {
        success: false,
        error: `Method ${methodName} not found in service ${serviceName}`
      };
    }

    const methodKey = this.reflector.get<string>('method', method);
    if (!methodKey) {
      return {
        success: false,
        error: `Method ${methodName} not exposed in service ${serviceName}`
      };
    }

    try {
      // 根据是否有参数调用方法
      let result;
      if (params !== undefined) {
        // 如果参数是数组，使用展开运算符
        if (Array.isArray(params)) {
          result = await method.apply(serviceInstance, params);
        }
        // 如果参数是对象且不是基本类型，直接传递
        else if (typeof params === 'object' && params !== null) {
          result = await method.call(serviceInstance, params);
        }
        // 如果是基本类型（字符串、数字、布尔值等），作为单个参数传递
        else {
          result = await method.call(serviceInstance, params);
        }
      }
      // 无参数调用
      else {
        result = await method.call(serviceInstance);
      }
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: `Error executing method: ${error.message}`,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
    }
  }
}
