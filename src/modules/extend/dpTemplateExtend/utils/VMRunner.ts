import * as changeCase from 'change-case';
import { VM } from 'vm2';
import { parseColumnType } from './parseColumnType';
import * as treeTool from 'src/utils/treeTool';
import * as _ from 'lodash';
import { getParams } from './getParams';
export class VMRunner {
  private static instance: VMRunner | null = null; // 静态属性保存唯一实例
  vm: VM;

  // 私有化构造函数防止外部 new 操作
  private constructor(options={}) {
    this.vm = new VM({
      timeout: 1000,
      sandbox: {
        utils: {
          changeCase,
          parseColumnType,
          treeTool,
          getParams,
          _,
          ...options
        },
        console: {
          log: (...args) => console.log(...args),
        },
      },
    });
  }

  // 静态方法获取单例
  public static getInstance(options={}): VMRunner {
    if (!VMRunner.instance) {
      VMRunner.instance = new VMRunner(options);
    }
    return VMRunner.instance;
  }

  run(code: string, context = {}) {
    try {
      this.vm.sandbox.context = context;
      const wrappedCode = `
      (function() {
        with(context) {
          ${code}
        }
      })()
    `;

      const result = this.vm.run(wrappedCode);
      this.vm.sandbox.context = {};
      return result;
    } catch (error) {
      return error.message;
    }
  }
}
