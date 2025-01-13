import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
// 导入所有功能模块
import { LogModule } from './modules/log/log.module';
// import { CategoryModule } from './modules/category/category.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { Log } from './modules/log/log.entity';
import { IpMiddleware } from './middlewares/ip.middleware';
import { GenModule } from './modules/extend/gen/gen.module';
import { DbModule } from './modules/extend/db/db.module';
import MODULE_LIST from './modules';
import { NavExtendModule } from './modules/extend/navExtend/navExtend.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    // TypeORM配置
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/modules/base/**/*.entity{.ts,.js}'], 
        synchronize: false, // 开发环境使用，生产环境请设置为false
        // dropSchema: true,
        autoLoadEntities: true,
        // logging: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Log]),
    // Winston日志模块
    WinstonModule.forRoot(winstonConfig),
    // 功能模块
    LogModule,
    // CategoryModule,
    GenModule,
    DbModule,
    NavExtendModule,
    ...MODULE_LIST
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: IpRoleGuard,
    // },
  ],
  exports: []
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}