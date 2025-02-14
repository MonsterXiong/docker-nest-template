import { VM } from 'vm2'
import * as changeCase from 'change-case'

export class FunctionRunner {
  // 构建内置工具库
  static createUtils() {
    return {
      changeCase
    };
  }

  // 执行函数
  static run(code, context = {}) {
    const vm = new VM({
      timeout: 1000,
      sandbox: {
        context,
        utils: this.createUtils(),
        console: {
          log: (...args) => console.log(...args)
        }
      }
    });

    const wrappedCode = `
      (function() {
        with(context) {
          ${code}
        }
      })()
    `;

    return vm.run(wrappedCode);
  }
}
