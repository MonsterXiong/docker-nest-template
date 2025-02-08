import * as ejs from 'ejs';
import * as changeCase from 'change-case';
import { VM } from 'vm2';

function buildTree(data) {
  const map = new Map();
  const result = new Map();

  // 过滤掉 templateExt 为 dir 的节点
  const filteredData = data.filter((item) => item.templateExt !== 'dir');

  // 初始化 map
  filteredData.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  // 构建树结构
  filteredData.forEach((item) => {
    const node = map.get(item.id);
    const parentId = item.parentId;

    if (parentId) {
      // 尝试获取父节点
      const parent = map.get(parentId);
      if (parent) {
        // 父节点存在，挂载到父节点的 children
        parent.children.push(node);
      } else {
        // 父节点不存在（被过滤），提升为顶级节点
        result.set(node.code, node);
      }
    } else {
      // 已经是顶级节点
      result.set(node.code, node);
    }
  });

  // 处理顶级节点的子级
  result.forEach((node, code) => {
    if (node.templateExt !== 'module') {
      // 如果顶级节点的 templateExt 不是 module，则子级中包含它本身
      node.children.unshift({ ...node, children: [] });
    }
  });

  return result;
}

export function genPageCode(projectInfo, templateList, menuList) {
  const templateMap = buildTree(templateList);
  const vmRunner = new VMRunner();
  const codeResult = [];
  menuList.forEach((menu) => {
    const configParam = JSON.parse(menu.menuDetail.configParam);
    const template = templateMap.get(configParam.type);
    const templateData = vmRunner.run(JSON.parse(template.templateAlgithorm), {
      projectInfo,
      menuInfo: menu,
    });
    const result = {
      ...menu,
      children: [],
    };

    // 开始遍历template中的children
    template.children.forEach((templateItem) => {
      try {
        const code = ejs.render(templateItem.templateCode, templateData);
        const relativePath = '';
        // 出来的结果应该是
        result.children.push({
          code,
          relativePath,
        });
      } catch (error) {
        console.log(error);
      }
    });
    codeResult.push(result);
  });
  return codeResult;
}

class VMRunner {
  vm: VM;
  constructor() {
    this.vm = new VM({
      timeout: 1000,
      sandbox: {
        utils: {
          changeCase,
        },
        console: {
          log: (...args) => console.log(...args),
        },
      },
    });
  }

  run(code, context = {}) {
    // 动态更新 params
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

    // 清理 context
    this.vm.sandbox.context = {};

    return result;
  }
}
