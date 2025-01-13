import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Log } from './log.entity';
import { QueryLogDto } from './dto/query-log.dto';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>
  ) {}

  /**
   * 创建日志
   */
  async create(log: Partial<Log>): Promise<Log> {
    const newLog = this.logRepository.create(log);
    return await this.logRepository.save(newLog);
  }

  /**
   * 查询所有日志列表
   */
  async findList(query: Partial<QueryLogDto>): Promise<Log[]> {
    const { startTime, endTime } = query;
    
    // 构建查询条件
    const where: any = {};
    
    if (startTime && endTime) {
      where.sysCreateTime = Between(new Date(startTime), new Date(endTime));
    }

    return await this.logRepository.find({
      where,
      order: {
        sysCreateTime: 'DESC'
      }
    });
  }

  /**
   * 分页查询日志
   */
  async findAll(query: QueryLogDto) {
    const { page = 1, limit = 10, startTime, endTime } = query;
    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {};
    
    if (startTime && endTime) {
      where.sysCreateTime = Between(new Date(startTime), new Date(endTime));
    }

    // 执行查询
    const [items, total] = await this.logRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: {
        sysCreateTime: 'DESC'
      }
    });

    // 计算总页数
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * 根据ID查询日志
   */
  async findById(id: string): Promise<Log> {
    return await this.logRepository.findOne({ where: { id } });
  }

  /**
   * 批量删除日志
   */
  async deleteMany(ids: number[]): Promise<void> {
    await this.logRepository.delete(ids);
  }

  /**
   * 清空日志
   */
  async clearAll(): Promise<void> {
    await this.logRepository.clear();
  }
}