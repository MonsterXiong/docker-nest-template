import { Injectable, Logger, OnApplicationShutdown, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { SScheduleTask } from './sScheduleTask.entity';
import { DbService } from 'src/modules/extend/db';

@Injectable()
export class SScheduleTaskService  {
  private readonly logger = new Logger(SScheduleTaskService.name);


  constructor(
    private readonly dbService: DbService,

    @InjectRepository(SScheduleTask)
    private sScheduleTaskRepository: Repository<SScheduleTask>,
    private schedulerRegistry: SchedulerRegistry
  ) {}
  // 初始化所有激活的定时任务
  async initTasks() {
    const tasks = await this.sScheduleTaskRepository.find({
      where: { status: 'RUNNING', sysIsDel: '0' }
    });
    tasks.forEach(task => {
      this.addCronJob(task);
    });
  }

  // 添加定时任务
  async addCronJob(task: SScheduleTask) {
    const job = new CronJob(task.cron, () => {
      this.executeTask(task);
    });

    this.schedulerRegistry.addCronJob(task.id, job);
    job.start();
    
    this.logger.log(`任务 ${task.name}(${task.id}) 已启动`);
  }

  // 立即执行任务
  async execute(id){
    const task = await this.getTask(id)
    return this.executeTask(task)
  }

  // 执行具体任务
  private async executeTask(task: SScheduleTask) {
    try {
      this.logger.log(`开始执行任务: ${task.name}`);
      if(task.type.startsWith('INTERNAL_')){
        this._handleTask(task)
      }else{
        switch(task.type) {
          case 'BACKUP':
            await this.handleBackupTask(task);
            break;
          // 添加更多任务类型
          default:
            this.logger.warn(`未知的任务类型: ${task.type}`);
        }
      }
      this.logger.log(`任务 ${task.name} 执行完成`);
    } catch (error) {
      this.logger.error(`任务 ${task.name} 执行失败: ${error.message}`);
    }
  }

  private async _handleTask(task){
    switch(task.type) {
      case 'INTERNAL_DB_BACKUP':
        await this.handleBackupTask(task);
        break;
      case 'INTERNAL_DB_TABLE_CLEANUP':
        await this.handleCleanupTable(task);
        break;
      // 添加更多任务类型
      default:
        this.logger.warn(`未知的任务类型: ${task.type}`);
    }
  }
  // 备份任务处理
  private async handleBackupTask(task: SScheduleTask) {
    console.log('xxx开始了');
    
    const params = JSON.parse(task.params || '{}');
    // 实现备份逻辑
  }

  // 清理任务处理
  private async handleCleanupTable(task: SScheduleTask) {
    const tasks = task.params.split(',')
    if(!tasks?.length){
      console.log('没有需要清空的表');
      return
    }
    this.dbService.execute(async (connection)=>{
      for await (const table of tasks) {
        console.log(`清理${table}表`);
        connection.query(`DELETE FROM ${table} where ISNULL(sys_is_del);`)
      }
      return '任务完成'
    })
  }

  // 创建新任务
  async createTask(taskData: Partial<SScheduleTask>) {
    const task = this.sScheduleTaskRepository.create(taskData);
    await this.sScheduleTaskRepository.save(task);
    
    if (task.status === 'RUNNING') {
      await this.addCronJob(task);
    }
    
    return task;
  }

  // 更新任务
  async updateTask(id: string, taskData: Partial<SScheduleTask>) {
    const task = await this.sScheduleTaskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('SScheduleTask not found');
    }

    // 如果任务正在运行，先停止它
    if (this.schedulerRegistry.getCronJob(id)) {
      this.schedulerRegistry.deleteCronJob(id);
    }

    // 更新任务数据
    Object.assign(task, taskData);
    await this.sScheduleTaskRepository.save(task);

    // 如果更新后的状态是 RUNNING，重新启动任务
    if (task.status === 'RUNNING') {
      await this.addCronJob(task);
    }

    return task;
  }

  // 删除任务
  async deleteTask(id: string) {
    const task = await this.sScheduleTaskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('SScheduleTask not found');
    }

    // 如果任务正在运行，先停止它
    if (this.schedulerRegistry.getCronJob(id)) {
      this.schedulerRegistry.deleteCronJob(id);
    }

    task.sysIsDel = null;
    await this.sScheduleTaskRepository.save(task);
  }

  // 启动任务
  async startTask(id: string) {
    const task = await this.sScheduleTaskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('SScheduleTask not found');
    }

    task.status = 'RUNNING';
    await this.sScheduleTaskRepository.save(task);
    await this.addCronJob(task);
  }

  // 停止任务
  async stopTask(id: string) {
    const task = await this.sScheduleTaskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('SScheduleTask not found');
    }

    if (this.schedulerRegistry.getCronJob(id)) {
      this.schedulerRegistry.deleteCronJob(id);
    }

    task.status = 'STOPPED';
    await this.sScheduleTaskRepository.save(task);
  }

  // 获取所有任务
  async getTasks() {
    return this.sScheduleTaskRepository.find({
      where: { sysIsDel: '0' }
    });
  }

  // 获取任务详情
  async getTask(id: string) {
    return this.sScheduleTaskRepository.findOne({ where: { id } });
  }

  // @Cron(CronExpression.EVERY_SECOND)
  // async get(){
  //   console.log('xxxx');
  // }

  // @Timeout(10000)
  // async get1(){
  //   console.log('xxxx111');
  // }
} 
// CronExpression.EVERY_SECOND
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