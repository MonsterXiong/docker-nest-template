import * as changeCase from 'change-case';
import path from 'path';
import { GenFeEnum } from 'src/enums/genTypeMap.enum';
export function format(data, isSingle, key = 'code') {
  const result = [];
  data.forEach((item) => {
    // 如果templateCode为空，在这一块会报错
    if (isSingle) {
      result.push(formatData(item, item[key]));
    } else {
      if (item?.children?.length) {
        item.children.forEach((childItem) => {
          result.push(formatData(childItem, item[key]));
        });
      }
    }
  });
  return result;
}

function formatData(item, name) {
  const Code = name ? changeCase.pascalCase(name) : '';
  const code = name ? changeCase.camelCase(name) : '';
  let filePath = item.filePath
    .replaceAll('{Code}', Code)
    .replaceAll('{code}', code);
  if (item.fileExt) {
    filePath += `.${item.fileExt}`;
  }
  return {
    content: item.code,
    filePath: path.join(filePath),
  };
}

export function removeFullPath(codeData, type) {
  let replaceStr = "replaceStr"
  if (type === GenFeEnum.BASE_SERVICE) {
    replaceStr = "src\\services\\module\\base"
  } else if(type === GenFeEnum.PAGE){
    replaceStr = "src\\pages\\"
  }else if(type === GenFeEnum.ROUTE){
    replaceStr = "src\\menuData\\menu\\"
  }else{
    return codeData
  }
  return codeData.map((item) => {
    let filePath = item.filePath.replace(replaceStr, '');
    return {
      ...item,
      filePath,
    };
  });
}
