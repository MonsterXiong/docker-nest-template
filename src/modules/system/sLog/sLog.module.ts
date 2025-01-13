import { Module } from '@nestjs/common';
import { SLogService } from './sLog.service';
import { SLogController } from './sLog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SLog } from './sLog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SLog])],
  controllers: [SLogController],
  providers: [SLogService],
  exports:[SLogService]
})
export class SLogModule { }