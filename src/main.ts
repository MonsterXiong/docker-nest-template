import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用 CORS
  app.enableCors();

  // 设置全局路由前缀
  // app.setGlobalPrefix('api');

  // 启用全局验证管道
  // app.useGlobalPipes(new ValidationPipe({
  //   transform: true,
  //   whitelist: true,
  //   forbidNonWhitelisted: true,
  // }));

  // 配置Swagger
  const config = new DocumentBuilder()
    .setTitle('My NestJS App')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // 全局应用异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局应用响应转换拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}/docs`);
}
bootstrap();
