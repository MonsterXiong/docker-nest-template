import * as changeCase from 'change-case';

export function formatEnum(enumList){
    return enumList.map(item=>{
        return {
            ...item,
            CODE:changeCase.constantCase(item.code),
            Code:changeCase.camelCase(item.code),
            attributes:item.attributes?.map(attr=>{
                return {
                    ...attr,
                    CODE:changeCase.constantCase(attr.code),
                    Code:changeCase.camelCase(attr.code),
                }
            })
        }
    })
}