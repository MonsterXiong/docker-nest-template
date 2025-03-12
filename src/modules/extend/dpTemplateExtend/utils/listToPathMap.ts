export function listToPathMap(list,options:any={}){
  const {codeKey = 'code',parentKey = 'parentId',isLeaf = false} = options
  const result = new Map()

  // 构建Id到节点的映射
  const idMap = {}
  list.forEach(item=>{
      idMap[item.id] = item
  })

  // 获取节点的完整路径
  const getNodePath = (node)=>{
      const path = []
      let currentNode = node;

      while(currentNode){
          if(currentNode[codeKey]){
              path.unshift(currentNode[codeKey])
          }
          currentNode = idMap[currentNode[parentKey]]
      }

      return path.join('.')
  }

  // 处理每个节点
  list.forEach((item,index)=>{
      // 如果isLeaf为true,则只处理叶子节点
      const isNodeLeaf = !list.some(node=>node[parentKey]===item.id)

      if(!isLeaf || isNodeLeaf){
          const path = getNodePath(item)
          if(path){
              result.set(path,item)
          }
      }
  })

  return result
}