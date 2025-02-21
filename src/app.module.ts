import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
// 导入所有功能模块
import { SLogModule,SLog } from './modules/system/sLog';
import { SCategoryModule } from './modules/system/sCategory';
import { SCategoryTypeModule } from './modules/system/sCategoryType';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { IpMiddleware } from './middlewares/ip.middleware';
import { GenModule } from './modules/extend/gen/gen.module';
import { DbModule } from './modules/extend/db/db.module';
import MODULE_LIST from './modules';
import { NavExtendModule } from './modules/extend/navExtend/navExtend.module';
import { DpTemplateSubscriber } from './subscribers/dpTemplate.subscriber';
import { CommonModule } from './modules/extend/common/common.module';
import { BootstrapModule } from './modules/extend/bootstrap/bootstrap.module';
import { DpProjectExtendModule } from './modules/extend/dpProjectExtend/dpProjectExtend.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './modules/system/tasks/tasks.module';
import { DpMenuExtendModule } from './modules/extend/dpMenuExtend/dpMenuExtend.module';
import { DpGenModule } from './modules/extend/dpGen/dpGen.module';
import { DpTemplateExtendModule } from './modules/extend/dpTemplateExtend/dpTemplateExtend.module';

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
        keepConnectionAlive: true,
        timezone: '+08:00',
        // logging: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([SLog]),
    // Winston日志模块
    WinstonModule.forRoot(winstonConfig),
    // 功能模块
    SLogModule,
    SCategoryModule,
    SCategoryTypeModule,
    GenModule,
    DbModule,
    NavExtendModule,
    ...MODULE_LIST,
    DpProjectExtendModule,
    CommonModule,
    BootstrapModule,
    ScheduleModule.forRoot(),
    TasksModule,
    DpMenuExtendModule,
    DpGenModule,
    DpTemplateExtendModule,
  ],
  providers: [
    DpTemplateSubscriber,
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