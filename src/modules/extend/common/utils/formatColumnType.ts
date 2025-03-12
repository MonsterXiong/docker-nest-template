/**
 * 格式化MySQL列类型
 * @param {Object} column 列定义对象
 * @returns {string} 格式化后的类型字符串
 */
export function formatColumnType(column) {
    const type = column.type.toLowerCase();
    switch (type) {
        case 'varchar':
        case 'int':
            return `${type.toUpperCase()}(${column.length})`;
        case 'decimal':
            const [precision, scale] = String(column.length).split(',');
            return `DECIMAL(${precision},${scale})`;
        default:
            return type.toUpperCase();
    }
}