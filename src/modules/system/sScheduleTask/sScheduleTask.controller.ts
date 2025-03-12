import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SScheduleTaskService } from './sScheduleTask.service';
import { SScheduleTask } from './sScheduleTask.entity';

@ApiTags('定时任务')
@Controller('tasks')
export class TasksController {
  constructor(private readonly SScheduleTaskService: SScheduleTaskService) {}

  @Post()
  @ApiOperation({ summary: '创建定时任务' })
  async createTask(@Body() taskData: Partial<SScheduleTask>) {
    return this.SScheduleTaskService.createTask(taskData);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新定时任务' })
  async updateTask(@Param('id') id: string, @Body() taskData: Partial<SScheduleTask>) {
    return this.SScheduleTaskService.updateTask(id, taskData);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除定时任务' })
  async deleteTask(@Param('id') id: string) {
    return this.SScheduleTaskService.deleteTask(id);
  }

  @Post(':id/start')
  @ApiOperation({ summary: '启动定时任务' })
  async startTask(@Param('id') id: string) {
    return this.SScheduleTaskService.startTask(id);
  }

  @Post(':id/stop')
  @ApiOperation({ summary: '停止定时任务' })
  async stopTask(@Param('id') id: string) {
    return this.SScheduleTaskService.stopTask(id);
  }

  @Post('execute')
  @ApiOperation({ summary: '立即执行任务' })
  async execute(@Param('id') id: string) {
    return this.SScheduleTaskService.execute(id);
  }

  @Get()
  @ApiOperation({ summary: '获取所有定时任务' })
  async getTasks() {
    return this.SScheduleTaskService.getTasks();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取定时任务详情' })
  async getTask(@Param('id') id: string) {
    return this.SScheduleTaskService.getTask(id);
  }

} 