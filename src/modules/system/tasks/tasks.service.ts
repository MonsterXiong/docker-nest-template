import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Task } from './tasks.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private schedulerRegistry: SchedulerRegistry
  ) {}

  // 初始化所有激活的定时任务
  async initTasks() {
    const tasks = await this.taskRepository.find({
      where: { status: 'RUNNING', sysIsDel: '0' }
    });
    
    tasks.forEach(task => {
      this.addCronJob(task);
    });
  }

  // 添加定时任务
  async addCronJob(task: Task) {
    const job = new CronJob(task.cron, () => {
      this.executeTask(task);
    });

    this.schedulerRegistry.addCronJob(task.id, job);
    job.start();
    
    this.logger.log(`任务 ${task.name}(${task.id}) 已启动`);
  }

  // 执行具体任务
  private async executeTask(task: Task) {
    try {
      this.logger.log(`开始执行任务: ${task.name}`);
      
      switch(task.type) {
        case 'BACKUP':
          await this.handleBackupTask(task);
          break;
        case 'CLEANUP':
          await this.handleCleanupTask(task);
          break;
        // 添加更多任务类型
        default:
          this.logger.warn(`未知的任务类型: ${task.type}`);
      }

      this.logger.log(`任务 ${task.name} 执行完成`);
    } catch (error) {
      this.logger.error(`任务 ${task.name} 执行失败: ${error.message}`);
    }
  }

  // 备份任务处理
  private async handleBackupTask(task: Task) {
    const params = JSON.parse(task.params || '{}');
    // 实现备份逻辑
  }

  // 清理任务处理
  private async handleCleanupTask(task: Task) {
    const params = JSON.parse(task.params || '{}');
    // 实现清理逻辑
  }

  // 创建新任务
  async createTask(taskData: Partial<Task>) {
    const task = this.taskRepository.create(taskData);
    await this.taskRepository.save(task);
    
    if (task.status === 'RUNNING') {
      await this.addCronJob(task);
    }
    
    return task;
  }

  // 更新任务
  async updateTask(id: string, taskData: Partial<Task>) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('Task not found');
    }

    // 如果任务正在运行，先停止它
    if (this.schedulerRegistry.getCronJob(id)) {
      this.schedulerRegistry.deleteCronJob(id);
    }

    // 更新任务数据
    Object.assign(task, taskData);
    await this.taskRepository.save(task);

    // 如果更新后的状态是 RUNNING，重新启动任务
    if (task.status === 'RUNNING') {
      await this.addCronJob(task);
    }

    return task;
  }

  // 删除任务
  async deleteTask(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('Task not found');
    }

    // 如果任务正在运行，先停止它
    if (this.schedulerRegistry.getCronJob(id)) {
      this.schedulerRegistry.deleteCronJob(id);
    }

    task.sysIsDel = '1';
    await this.taskRepository.save(task);
  }

  // 启动任务
  async startTask(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('Task not found');
    }

    task.status = 'RUNNING';
    await this.taskRepository.save(task);
    await this.addCronJob(task);
  }

  // 停止任务
  async stopTask(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('Task not found');
    }

    if (this.schedulerRegistry.getCronJob(id)) {
      this.schedulerRegistry.deleteCronJob(id);
    }

    task.status = 'STOPPED';
    await this.taskRepository.save(task);
  }

  // 获取所有任务
  async getTasks() {
    return this.taskRepository.find({
      where: { sysIsDel: '0' }
    });
  }

  // 获取任务详情
  async getTask(id: string) {
    return this.taskRepository.findOne({ where: { id } });
  }
} 

// CronExpression.EVERY_SECOND = '* * * * * *'
// CronExpression.EVERY_5_SECONDS = '*/5 * * * * *'
// CronExpression.EVERY_10_SECONDS = '*/10 * * * * *'
// CronExpression.EVERY_30_SECONDS = '*/30 * * * * *'
// CronExpression.EVERY_MINUTE = '0 * * * * *'
// CronExpression.EVERY_5_MINUTES = '0 */5 * * * *'
// CronExpression.EVERY_10_MINUTES = '0 */10 * * * *'
// CronExpression.EVERY_30_MINUTES = '0 */30 * * * *'
// CronExpression.EVERY_HOUR = '0 0 * * * *'
// CronExpression.EVERY_2_HOURS = '0 0 */2 * * *'
// CronExpression.EVERY_DAY_AT_1AM = '0 0 1 * * *'
// CronExpression.EVERY_DAY_AT_MIDNIGHT = '0 0 0 * * *'
// CronExpression.EVERY_WEEK = '0 0 * * 0'
// CronExpression.EVERY_MONTH = '0 0 1 * *'


// @Cron() - 用于配置定时任务的执行时间,支持 cron 表达式
// @Interval() - 用于设置固定时间间隔的重复任务
// @Timeout() - 用于设置一次性延迟执行的任务