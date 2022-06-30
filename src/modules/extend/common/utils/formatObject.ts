export function formatObject(data,initialIndent = 0){
    function format(data,level){
        const indent = '  '.repeat(level)
        if(data === null) return 'null';
        // 保持函数的可读性
        if(typeof data === 'function') return data.toString()
        
        // 处理数组
        if(Array.isArray(data)){
            if(data.length ===0) return '[]';

            const isSimpleArray = data.every(item=>typeof item !=='object' || item===null)

            if(isSimpleArray){
                const items = data.map(item=>format(item,0));
                return `[${items.join(', ')}]`;
            }else{
                const items = data.map(item=>`${indent}  ${format(item,level + 1).trimLeft()}`)
                return `[\n${items.join(',\n')}\n${indent}]`
            }
        }

        // 处理对象
        if(typeof data === 'object'){
            const entries = Object.entries(data)
            if(entries.length === 0 ) return '{}'

            const items = entries.map(([key,value])=>{
                const formattedValue = format(value,level+1);
                return `${indent}  ${key}: ${formattedValue}`
            })
            return `{\n${items.join(',\n')}\n${indent}}`
        }

        return JSON.stringify(data)
    }

    const result = format(data,0)
    if(initialIndent === 0) return result;
    // 为每一行添加初始缩进
    const indentStr='  '.repeat(initialIndent);
    return result.split('\n').map(line=>`${indentStr}${line}`).join('\n')
}