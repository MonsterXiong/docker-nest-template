import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';

@ApiTags('定时任务')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: '创建定时任务' })
  async createTask(@Body() taskData: Partial<Task>) {
    return this.tasksService.createTask(taskData);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新定时任务' })
  async updateTask(@Param('id') id: string, @Body() taskData: Partial<Task>) {
    return this.tasksService.updateTask(id, taskData);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除定时任务' })
  async deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }

  @Post(':id/start')
  @ApiOperation({ summary: '启动定时任务' })
  async startTask(@Param('id') id: string) {
    return this.tasksService.startTask(id);
  }

  @Post(':id/stop')
  @ApiOperation({ summary: '停止定时任务' })
  async stopTask(@Param('id') id: string) {
    return this.tasksService.stopTask(id);
  }

  @Get()
  @ApiOperation({ summary: '获取所有定时任务' })
  async getTasks() {
    return this.tasksService.getTasks();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取定时任务详情' })
  async getTask(@Param('id') id: string) {
    return this.tasksService.getTask(id);
  }
} 