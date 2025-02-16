

import * as changeCase from 'change-case';
import { VM } from 'vm2';
import { parseColumnType } from './parseColumnType';
import * as treeTool from 'src/utils/treeTool';

export class VMRunner {
  private static instance: VMRunner | null = null;  // 静态属性保存唯一实例
  vm: VM;

  // 私有化构造函数防止外部 new 操作
  private constructor() {
    this.vm = new VM({
      timeout: 1000,
      sandbox: {
        utils: {
          changeCase,
          parseColumnType,
          treeTool
        },
        console: {
          log: (...args) => console.log(...args),
        },
      },
    });
  }

  // 静态方法获取单例
  public static getInstance(): VMRunner {
    if (!VMRunner.instance) {
      VMRunner.instance = new VMRunner();
    }
    return VMRunner.instance;
  }

  run(code: string, context = {}) {
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
  }
}