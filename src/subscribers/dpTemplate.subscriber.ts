// template.subscriber.ts
import { DpTemplate } from 'src/modules/base/dpTemplate';
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';
import { QueryEvent } from 'typeorm/subscriber/event/QueryEvent.js';


@EventSubscriber()
export class DpTemplateSubscriber implements EntitySubscriberInterface<DpTemplate> {
  listenTo() {
    console.log('xxxxx');
    
    return DpTemplate; // 监听特定实体
  }

  afterQuery(event: QueryEvent<DpTemplate>) {
    console.log('捕获到查询操作', event,event.query, event.parameters);
    
    if (event.query.startsWith('INSERT INTO template')) {
      console.log('捕获到 INSERT 操作', event.parameters);
    }
  }

  afterInsert(event: InsertEvent<DpTemplate>) {
    console.log(`[INSERT] 表 ${event.metadata.tableName}`, event.entity);
    // 触发缓存更新逻辑
  }

  afterUpdate(event: UpdateEvent<DpTemplate>) {
    console.log(`[UPDATE] 表 ${event.metadata.tableName}`, event.entity);
    // 注意：event.databaseEntity 包含更新前的数据
  }

  afterRemove(event: RemoveEvent<DpTemplate>) {
    console.log(`[DELETE] 表 ${event.metadata.tableName}`, event.entity);
  }
}
