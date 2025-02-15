interface MyTreeNode extends TreeNode {
    id: number;
    parentId: number | null;
    name: string;
    children?: MyTreeNode[];
}

// 定义树节点基础接口（可根据需要扩展）
export interface TreeNode {
    [key: string]: any;
    children?: TreeNode[];
    __parent?: TreeNode;
    __level?: number;
}

// 列表转树选项类型
interface ListToTreeOptions<T extends TreeNode> {
    idKey?: keyof T;
    pidKey?: keyof T;
    childKey?: string;
}

// 树转列表选项类型
interface TreeToListOptions<T extends TreeNode> {
    childKey?: keyof T;
}

// 设置层级选项类型
interface SetTreeLevelOptions<T extends TreeNode> {
    initialLevel?: number;
    childKey?: keyof T;
    levelKey?: string;
}

// 设置父节点选项类型
interface SetTreeNodeParentOptions<T extends TreeNode> {
    parentKey?: string;
    childKey?: keyof T;
}

// 遍历函数类型
type TreeForEachFn<T extends TreeNode> = (item: T, tree: T[]) => void;

// 过滤函数类型
type TreeFilterPredict<T extends TreeNode> = (item: T, tree: T[]) => boolean;

/**
 * 将列表转换为树形结构
 * @param list 原始列表数据
 * @param options 配置选项
 */
export function listToTree<T extends TreeNode>(
    list: T[],
    options: ListToTreeOptions<T> = {}
): T[] {
    const {
        idKey = 'id' as keyof T,
        pidKey = 'parentId' as keyof T,
        childKey = 'children' as keyof T
    } = options;

    if (!Array.isArray(list)) return [];

    const idMap: Record<string | number, T> = {};
    const tree: T[] = [];

    // 创建ID映射
    list.forEach(item => {
        const id = item[idKey];
        idMap[id as string | number] = item;
    });

    // 构建树结构
    list.forEach(item => {
        const parentId = item[pidKey];
        const parent = idMap[parentId as string | number];

        // 如果有父节点，则将当前节点添加到父节点的 children 中
        if (parent) {
            ensureChildArray(parent, childKey);
            parent[childKey]?.push(item);
        } else {
            // 否则，将当前节点添加到根节点列表中
            tree.push(item);
        }
    });

    return tree;
}

// 辅助函数：确保某个节点的子节点是一个数组
function ensureChildArray<T extends TreeNode>(node: T, childKey: keyof T): void {
    if (!Array.isArray(node[childKey])) {
        node[childKey] = [] as unknown as T[keyof T]; // 明确类型断言
    }
}

/**
 * 将树形结构转换为列表
 * @param tree 树形数据
 * @param options 配置选项
 */
export function treeToList<T extends TreeNode>(
    tree: T[],
    options: TreeToListOptions<T> = {}
): T[] {
    const { childKey = 'children' as keyof T } = options;

    if (!Array.isArray(tree)) return [];

    const result: T[] = [];

    function traverse(nodes: T[]) {
        nodes.forEach(node => {
            result.push({ ...node }); // 深拷贝节点以避免修改原始数据
            const children = node[childKey] as T[] | undefined;
            if (children?.length) {
                traverse(children);
            }
        });
    }

    traverse(tree);

    return result;
}

/**
 * 设置树节点层级
 * @param tree 树形数据
 * @param options 配置选项
 */
export function setTreeLevel<T extends TreeNode>(
    tree: T[],
    options: SetTreeLevelOptions<T> = {}
): T[] {
    const {
        initialLevel = 1,
        childKey = 'children' as keyof T,
        levelKey = '__level'
    } = options;

    function traverse(nodes: T[], level: number) {
        nodes.forEach(node => {
            Object.assign(node, { [levelKey]: level }); // 安全地设置层级
            const children = node[childKey] as T[] | undefined;
            if (children?.length) {
                traverse(children, level + 1);
            }
        });
    }

    traverse(tree, initialLevel);
    return tree;
}

/**
 * 设置树节点父级引用
 * @param tree 树形数据
 * @param options 配置选项
 */
export function setTreeNodeParent<T extends TreeNode>(
    tree: T[],
    options: SetTreeNodeParentOptions<T> = {}
): void {
    const { parentKey = '__parent', childKey = 'children' as keyof T } = options;

    function traverse(nodes: T[]) {
        nodes.forEach(node => {
            const children = node[childKey] as T[] | undefined;
            if (children?.length) {
                children.forEach(child => {
                    Object.assign(child, { [parentKey]: node }); // 安全地设置父级引用
                });
                traverse(children);
            }
        });
    }

    traverse(tree);
}

/**
 * 查找叶子节点
 * @param tree 树形数据
 * @param options 配置选项
 */
export function findLeafNode<T extends TreeNode>(
    tree: T[],
    options: TreeToListOptions<T> = {}
): T[] {
    const { childKey = 'children' as keyof T } = options;
    return filterTree(
        tree,
        (item: T) => !item[childKey] || item[childKey]?.length === 0,
        childKey
    );
}

/**
 * 过滤树节点
 * @param tree 树形数据
 * @param predict 过滤函数
 * @param childKey 子节点键名
 */
export function filterTree<T extends TreeNode>(
    tree: T[],
    predict: TreeFilterPredict<T>,
    childKey: keyof T = 'children' as keyof T
): T[] {
    const result: T[] = [];

    function traverse(nodes: T[]) {
        nodes.forEach(node => {
            if (predict(node, nodes)) {
                result.push(node);
            }
            const children = node[childKey] as T[] | undefined;
            if (children?.length) {
                traverse(children);
            }
        });
    }

    if (tree?.length) {
        traverse(tree);
    }
    return result;
}
