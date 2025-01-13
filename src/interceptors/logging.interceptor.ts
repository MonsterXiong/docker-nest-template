import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from '../modules/log/log.entity'; 
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { nanoid } from 'nanoid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    return next.handle().pipe(
      tap(async (data) => {
        const log = new Log();
        log.id = nanoid()
        log.sysCreateIp = this.getClientIp(request);
        log.method = request.method;
        log.path = request.url;
        log.sysCreateTime = new Date().toISOString();
        log.params = JSON.stringify({
          query: request.query,
          body: request.body,
          params: request.params,
        });
        // log.result = JSON.stringify(data);
        
        // 如果有用户信息，记录用户信息
        // if (request.user) {
        //   log.userId = request.user.id;
        //   log.username = request.user.username;
        // }

        await this.logRepository.save(log);

        // 使用 Winston 记录日志
        this.logger.info('Operation Log', {
          ip: log.sysCreateIp,
          method: log.method,
          path: log.path,
          duration: `${Date.now() - startTime}ms`,
          status: response.statusCode,
        });
      }),
    );
  }
  private getClientIp(request: any): string {
    const ip = request.headers['x-forwarded-for']?.split(',')[0] ||
      request.ip ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress;

    // 如果是 IPv6 格式的 ::ffff:127.0.0.1，提取 IPv4 部分
    if (ip.includes('::ffff:')) {
      return ip.split(':').pop();
    }

    // 如果是 IPv6 的 ::1，转换为 127.0.0.1
    if (ip === '::1') {
      return '127.0.0.1';
    }

    return ip;
  }
} 