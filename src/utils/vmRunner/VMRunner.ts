import * as changeCase from 'change-case';
import { VM } from 'vm2';
import * as _ from 'lodash';

/**
 * 虚拟机配置接口
 */
export interface VMOptions {
  /** 超时时间（毫秒） */
  timeout?: number;
  /** 附加工具 */
  additionalUtils?: Record<string, unknown>;
}

/**
 * 虚拟机执行结果接口
 */
export interface VMResult<T = unknown> {
  /** 是否成功 */
  success: boolean;
  /** 执行结果 */
  data?: T;
  /** 错误信息 */
  error?: string;
}

/**
 * 安全的JavaScript虚拟机运行器
 *
 * 采用单例模式实现，使用vm2库提供沙箱隔离环境，
 * 用于安全执行动态JavaScript代码
 */
export class VMRunner {
  /**
   * 单例实例
   * @private
   */
  private static instance: VMRunner | null = null;

  /**
   * 虚拟机实例
   * @private
   */
  private readonly vm: VM;

  /**
   * 私有构造函数
   * @param options 虚拟机配置选项
   * @private
   */
  private constructor(options: VMOptions = {}) {
    const { timeout = 1000, additionalUtils = {} } = options;

    this.vm = new VM({
      timeout,
      sandbox: {
        utils: {
          changeCase,
          _,
          ...additionalUtils,
        },
        console: {
          log: (...args: unknown[]) => console.log(...args),
        },
      },
    });
  }

  /**
   * 获取VMRunner单例
   * @param options 虚拟机配置选项
   * @returns VMRunner实例
   */
  public static getInstance(options: VMOptions = {}): VMRunner {
    if (!VMRunner.instance) {
      VMRunner.instance = new VMRunner(options);
    }
    return VMRunner.instance;
  }

  /**
   * 重置VM实例
   * 用于清除虚拟机状态或更改配置
   * @param options 新的虚拟机配置选项
   * @returns 新的VMRunner实例
   */
  public static resetInstance(options: VMOptions = {}): VMRunner {
    VMRunner.instance = null;
    return VMRunner.getInstance(options);
  }

  /**
   * 在安全的沙箱环境中执行JavaScript代码
   * @template T 返回结果类型
   * @param code 要执行的JavaScript代码
   * @param context 代码执行上下文
   * @returns 执行结果
   */
  public run<T = unknown>(
    code: string,
    context: Record<string, unknown> = {},
  ): VMResult<T> {
    try {
      // 设置执行上下文
      this.vm.sandbox.context = context;

      const wrappedCode = `
      (function() {
        with(context) {
          ${code}
        }
      })()
    `;

      // 执行代码
      const result = this.vm.run(wrappedCode);

      // 清理上下文
      this.vm.sandbox.context = {};

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      // 错误处理
      console.error('VM执行错误:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
