import * as changeCase from 'change-case'

function getValueByCondition(params,{ prop='valueType', value='', type=''}={}){
    const item =params.find(item=>item[prop]==value)?.value || ''
    if(!type){
        return item
    }
    return changeCase[type](item) || ''
}
function getFormItem(item){
    return {
        ...item,
        camelProp:changeCase.camelCase(item?.value || ''),
        name: item?.label,
        required: item?.required || false,
        query: item?.query || false,
        type: item?.type || '',
        sqlTable: changeCase.pascalCase(item?.sqlTable || ''),
        bindProp: changeCase.camelCase(item?.bindProp || ''),
        showName: changeCase.camelCase(item?.showName || ''),
        relationProp: changeCase.camelCase(item?.relationProp || '')
    }
}

function setColumnList(arr){
    const result = []
    arr.forEach(item=>{
      let param = {
        code: item.camelProp,
        label: item.name,
        query: item.query,
        required: item.required,
        multiple: item.multiple || false,
        type: item.type
      }
      if(item.type == 'select' && !item?.option?.length){
        param['dataType'] = item.selectDataType
        if(item.selectDataType == 'interface'){
            param['params'] = {
                service: item.sqlTable,
            }
            if(item.relationProp && item.defaultValue){
                param['params']['relationProp'] = {
                    [item.relationProp]: item.defaultValue
                }
            }
        } else if(item.selectDataType == 'enum') {
            param['params'] = item.params
        } else {
            param['options'] = item.opitons
        }
      }
          result.push(param)
      })
      return result
  }

export function getParams(configParam,type, index){
    const page = configParam.page.find(item=>item.code==type)
    const child = page.children[index]
    const params = child.params
    const code = child.code
    const name = child.name
    const globalProject = child.globalProject
    const service = getValueByCondition(params,{value:'sql',type:'pascalCase'})
    const relationParam = getValueByCondition(params,{prop:'code',value:'relation',type:'camelCase'})
    const uniqueCode = getValueByCondition(params,{value:'uniqueCode',type:'camelCase'})
    const sqlParams = getValueByCondition(params,{value:'table'}) || []
    const itemName = getValueByCondition(params,{prop:'code',value:'name',type:'camelCase'})
    const column = sqlParams.filter(item=>item.show || item.showInForm).map(item=>{
        return getFormItem(item)
    })
    const formParams = getValueByCondition(params,{value:'formItem'})
    let formItem = formParams?.props?.map(item=>{
        return getFormItem(item)
    })
    let nodeColumnList = []
    if(formItem?.length){
        nodeColumnList = setColumnList(formItem)
    }
    
    let globalBind = getValueByCondition(params,{ value:'globalBind'}) || []
    globalBind = globalBind.map(item=>{
        return {
            ...item,
            camelBind: changeCase.camelCase(item?.bind),
            Bind: changeCase.pascalCase(item?.bind),
            BIND: changeCase.constantCase(item?.bind),
            prop: changeCase.camelCase(item?.value),
        }
    })

    const parentId = getValueByCondition(params,{prop:'code',value:'parentId',type:'camelCase'})
    return {
        globalProject,
        service,
        relationParam,
        uniqueCode,
        column,
        code,
        parentId,
        name,
        formItem,
        itemName,
        nodeColumnList,
        globalBind
    }
}
