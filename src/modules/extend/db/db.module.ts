import { Module, Global, forwardRef } from '@nestjs/common';
import { DbService } from './db.service';
import { DbController } from './db.controller';
import { CommonModule } from '../common/common.module';

/**
 * 数据库管理模块
 * 提供数据库连接和表结构管理功能
 */
@Global()
@Module({
  imports: [],
  controllers: [DbController],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
