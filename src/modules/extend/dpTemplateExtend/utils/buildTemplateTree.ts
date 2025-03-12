export function buildTemplateTree(data) {
  // 过滤掉category类型的节点
  const filtered = data.filter((item) => item.templateType !== 'category');
  const nodeMap = new Map(filtered.map((node) => [node.id, node]));

  // 找到所有顶级节点（其父节点不在过滤后的列表中）
  const topLevelNodes = filtered.filter((node) => !nodeMap.has(node.parentId));

  function collectDescendants(parentNode, baseDepth, basePath, basePathKey) {
    const descendants = [];

    const stack = [
      {
        node: parentNode,
        depth: baseDepth + 1,
        filePath:
          parentNode.templateType == 'module'
            ? parentNode.relativePath
            : `${basePath}/${parentNode.relativePath}`,
        pathKey:
          parentNode.templateType == 'module'
            ? parentNode.code
            : `${basePathKey}.${parentNode.code}`,
      },
    ];

    while (stack.length > 0) {
      const { node, depth, filePath, pathKey } = stack.pop();

      // 收集当前节点（排除自己）
      if (node.id !== parentNode.id) {
        descendants.push({
          ...node,
          depth,
          filePath,
          pathKey,
          children: [],
        });
      }

      // 继续遍历子节点
      const children = filtered.filter((n) => n.parentId === node.id);
      for (const child of children) {
        stack.push({
          node: child,
          depth: depth + 1,
          filePath: filePath
            ? `${filePath}/${child.relativePath}`
            : child.relativePath,
          pathKey: `${pathKey}.${child.code}`,
        });
      }
    }
    return descendants;
  }

  return topLevelNodes.map((node) => {
    const isModule = node.templateType === 'module';
    const basePath = node.relativePath;
    const depth = 1;
    const basePathKey = node.code;
    // 构建当前节点
    const currentNode = {
      ...node,
      depth,
      filePath: basePath,
      pathKey: basePathKey,
      children: [],
    };

    // 处理特殊逻辑
    if (!isModule) {
      // 非module类型节点添加自身副本
      currentNode.children.push({
        ...currentNode,
        parentId: node.id, // 防止被误认为顶级节点
        children: [],
      });
    } else {
      // 收集所有后代节点（平铺）
      currentNode.children = collectDescendants(
        node,
        depth,
        basePath,
        basePathKey,
      );
    }

    return currentNode;
  });
}

export function handleProceeQuote(nodes) {
  const result = []
  nodes.forEach(node=>{
    let children = []
    const newNode = node
    node.children.forEach(child=>{
      if(child.templateType !=='quote'){
        children.push(child)
      }else{
        // 处理quote
        const quoteModule = nodes.find(item=>item.code === child.code)
        const quoteModulePath = quoteModule.relativePath

        const quoteChildren = quoteModule.children.map(item=>{
          // 清洗filePath
          const prefixPath = child.filePath.replace(node.filePath,'')
          const replacePath = `${node.relativePath?prefixPath:''}`
          
          let filePath = item.filePath.replace(quoteModulePath,replacePath)
          if(!child.relativePath){
            filePath = filePath.replace('/null','')
          }
          return{
            ...item,
            filePath:`${node.relativePath}${filePath}`
          }
        })
        children = children.concat(quoteChildren)
        // console.log(children.map(item=>{return {...item,templateCode:''}}));
      }
    })
    newNode.children = children
    result.push(newNode)
  })
  return result
}
