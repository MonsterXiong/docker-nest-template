import { nanoid } from 'nanoid';
export function findTreeByArr(data, targetId, options: any = {}) {
  const { idKey = 'id', parentKey = 'parentId', includeSelf = true } = options;

  // 1. 查找目标节点及其所有子孙
  const targetNode = data.find((item) => item[idKey] === targetId);
  if (!targetNode) {
    return null;
  }

  function collectDescendants(parentId) {
    return data.filter((item) => item[parentKey] === parentId);
  }

  function findAllDescendants(nodeId) {
    const result = [];
    const directChildren = collectDescendants(nodeId);

    result.push(...directChildren);

    directChildren.forEach((child) => {
      result.push(...findAllDescendants(child[idKey]));
    });

    return result;
  }

  const allDescendants = findAllDescendants(targetId);
  const relevantNodes = includeSelf
    ? [targetNode, ...allDescendants]
    : allDescendants;
  return relevantNodes;
}
/**
 * 刷新扁平数组中所有节点的ID和parentID
 * @param {Array} flatData - 扁平数据数组
 * @param {string|number} targetId - 要作为根节点的ID
 * @param {Object} options - 配置选项
 * @param {string} options.idKey - ID字段的键名，默认为'id'
 * @param {string} options.parentKey - 父级ID字段的键名，默认为'parentId'
 * @param {string|number} options.topParentId - 顶级节点的父ID，默认为null
 * @param {boolean} options.includeSelf - 是否包含目标节点本身，默认为true
 * @returns {Array} 刷新ID后的扁平数组
 */
export function refreshFlatIds(
  flatData,
  targetId,
  topParentId = null,
  options: any = {},
) {
  const { idKey = 'id', parentKey = 'parentId', includeSelf = true } = options;

  // ID映射表：旧ID -> 新ID
  const idMap = new Map();

  // 为所有相关节点生成新ID
  flatData.forEach((node) => {
    idMap.set(node[idKey], nanoid());
  });

  // 更新所有节点的ID和parentID
  return flatData.map((node) => {
    const newNode = { ...node };
    const oldId = node[idKey];
    const oldParentId = node[parentKey];

    // 设置新ID
    newNode[idKey] = idMap.get(oldId);

    // 设置新的parentID
    if (oldId === targetId && includeSelf) {
      // 目标节点的父ID设为指定的顶级父ID
      newNode[parentKey] = topParentId;
    } else if (idMap.has(oldParentId)) {
      // 如果父节点也在结果集中，使用它的新ID
      newNode[parentKey] = idMap.get(oldParentId);
    } else if (!includeSelf && oldParentId === targetId) {
      // 当不包含自身且节点的父ID是目标ID时，将父ID设为顶级父ID
      newNode[parentKey] = topParentId;
    }
    // 其他情况保持原父ID不变

    return newNode;
  });
}
