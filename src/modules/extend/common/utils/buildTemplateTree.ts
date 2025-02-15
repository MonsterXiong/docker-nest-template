export function buildTemplateTree(data) {
    // 过滤掉category类型的节点
    const filtered = data.filter(item => item.templateType !== 'category');
    const nodeMap = new Map(filtered.map(node => [node.id, node]));
  
    // 找到所有顶级节点（其父节点不在过滤后的列表中）
    const topLevelNodes = filtered.filter(node => !nodeMap.has(node.parentId));
  
    function collectDescendants(parentNode, baseDepth, basePath) {
      const descendants = [];
      const stack = [{ node: parentNode, depth: baseDepth + 1, path: parentNode.templateType == 'module'?'':`${basePath}/${parentNode.code}` }];
      
      while (stack.length > 0) {
        const { node, depth, path } = stack.pop();
        
        // 收集当前节点（排除自己）
        if (node.id !== parentNode.id) {
          descendants.push({
            ...node,
            depth,
            relativePath: path,
            children: []
          });
        }
  
        // 继续遍历子节点
        const children = filtered.filter(n => n.parentId === node.id);
        for (const child of children) {
          stack.push({
            node: child,
            depth: depth + 1,
            path: `${path}/${child.code}`
          });
        }
      }
      return descendants;
    }
  
    return topLevelNodes.map(node => {
      const isModule = node.templateType === 'module';
      const basePath = '';
      const depth = 1;
  
      // 构建当前节点
      const currentNode = {
        ...node,
        depth,
        relativePath: basePath,
        children: []
      };
  
      // 处理特殊逻辑
      if (!isModule) {
        // 非module类型节点添加自身副本
        currentNode.children.push({
          ...currentNode,
          parentId: node.id, // 防止被误认为顶级节点
          children: []
        });
      } else {
        // 收集所有后代节点（平铺）
        currentNode.children = collectDescendants(node, depth, basePath);
      }
  
      return currentNode;
    });
  }