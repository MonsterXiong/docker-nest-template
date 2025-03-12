import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './sScheduleTask.controller';
import { SScheduleTaskService } from './sScheduleTask.service';
import { SScheduleTask } from './sScheduleTask.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SScheduleTask])],
  controllers: [TasksController],
  providers: [SScheduleTaskService],
  exports: [SScheduleTaskService],
})
export class SScheduleTaskModule implements OnModuleInit {
  constructor(private sScheduleTaskServiceService: SScheduleTaskService) {}

  async onModuleInit() {
    console.log("初始化任务");
    await this.sScheduleTaskServiceService.initTasks();
  }
}