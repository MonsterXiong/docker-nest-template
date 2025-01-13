import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let ip = req.ip || 
             req.headers['x-forwarded-for'] || 
             req.socket.remoteAddress || 
             '';

    // 如果是数组，取第一个 IP
    if (Array.isArray(ip)) {
      ip = ip[0];
    }

    // 处理 IPv6 格式
    if (ip.includes('::')) {
      if (ip === '::1' || ip.includes('::ffff:')) {
        // 将 ::1 或 ::ffff:127.0.0.1 转换为 127.0.0.1
        ip = ip.replace(/::1/, '127.0.0.1')
               .replace(/::ffff:/, '');
      }
    }

    // 处理 localhost
    if (ip === 'localhost') {
      ip = '127.0.0.1';
    }

    // 保存处理后的 IP 到请求对象中
    req['realIp'] = ip;
    
    next();
  }
} 