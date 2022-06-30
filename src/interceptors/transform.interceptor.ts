import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '../interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp()
    const response = ctx.getResponse()
    return next.handle().pipe(
      map(data => {
        const params:any = {
          statusCode:200,
          code: 200,
          message: '请求成功',
          timestamp: new Date().toISOString(),
        }
        
        if(data && data.count!== undefined){
          params.data = data.data
          params.count = data.count
        }else{
          params.data = data
        }
        response.status(200)
       return params
      }),
    );
  }
} 