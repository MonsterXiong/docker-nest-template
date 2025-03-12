/**
 * 元数据体系适配器 - 将元数据体系的数据转换为标准MySQL描述结构
 */
export class MetaDatabaseAdapter {
    /**
     * 转换数据库描述
     * @param {Object} metaDatabase 项目数据
     * @returns {Object} MySQL数据库描述
     */
    convertDatabase(metaDatabase) {
        return {
            name: metaDatabase?.code?.toLowerCase() || '',
            comment: metaDatabase?.name || ''
        };
    }

    /**
     * 转换表描述
     * @param {Object} entities 实体数据
     * @returns {Object} MySQL表描述
     */
    convertTable(entities) {
        if (!entities) return null;
        return {
            name: entities.code || '',
            comment: entities.name || '',
            columns: this.convertColumns(entities.attributes || [])
        };
    }

    /**
     * 转换字段描述
     * @param {Array} attributes 属性数组
     * @returns {Array} MySQL字段描述数组
     */
    convertColumns(attributes) {
        if (!Array.isArray(attributes)) return [];
        return attributes.map(attr => {
            // 如果元数据中没有指定长度，则使用默认长度
            const length = attr.length || this.getDefaultLength(attr.bindDataType);
            
            return {
                name: attr.code || '',
                type: this.convertDataType(attr.bindDataType || 'varchar'),
                length,
                nullable: attr.required_flag !== 1,
                default: attr.primaryFlag === 1 ? undefined : null, // 主键不设置默认值
                primary: attr.primaryFlag === 1,
                comment: attr.name || ''
            };
        });
    }

    /**
     * 获取默认字段长度
     * @param {string} dataType 元数据类型
     * @returns {number|string} 默认字段长度
     */
    getDefaultLength(dataType) {
        switch (dataType?.toLowerCase()) {
            case 'varchar':
                return 255;
            case 'int':
                return 11;
            case 'decimal':
                return '10,2';
            default:
                return 255;
        }
    }

    /**
     * 转换数据类型
     * @param {string} dataType 元数据类型
     * @returns {string} MySQL数据类型
     */
    convertDataType(dataType) {
        switch (dataType.toLowerCase()) {
            case 'varchar':
                return 'varchar';
            case 'int':
                return 'int';
            case 'decimal':
                return 'decimal';
            case 'date':
                return 'date';
            default:
                return 'varchar';
        }
    }

    /**
     * 转换完整的元数据结构
     * @param {Object} metaData 元数据
     * @returns {Object} MySQL描述结构
     */
    convert(metaData) {
        if (!metaData) return { database: {}, tables: [] };
        
        const database = this.convertDatabase(metaData);
        const tables = (metaData.entities || [])
            .map(entity => this.convertTable(entity))
            .filter(Boolean);
        
        return {
            database,
            tables
        };
    }
}
