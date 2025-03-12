import { nanoid } from 'nanoid';

export  function refreshEntity(entity,attrList,databaseId){
    const entityId = nanoid();
    const attributes = attrList.map((attr) => {
      return {
        ...attr,
        id: nanoid(),
        bindDatabase: databaseId,
        bindEntity: entityId,
      };
    });
    const entityInfo = {
      ...entity,
      bindDatabase: databaseId,
      id: entityId,
    };
    return {
        entityInfo,
        attributes
    }
}

export function refreshEntities(entities,databaseId){
  const entityList = []
  let attrList = []
  entities.forEach((item) => {
    const { entityInfo,attributes}=refreshEntity(item,item.attributes,databaseId)
    delete entityInfo.attributes;
    entityList.push(entityInfo)
    attrList=[...attrList,...attributes]
  });
  return {
    entityList,
    attrList
  }
}