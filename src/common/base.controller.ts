// import { 
//   Get, Post, Put, Delete, Body, Param, Query, 
//   Res, UseInterceptors, UploadedFile, ParseArrayPipe,
//   DefaultValuePipe, ParseIntPipe, Req
// } from '@nestjs/common';
// import { ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { Response, Request } from 'express';
// import { BaseService } from './base.service';

// export interface BaseEntity {
//   [key: string]: any;
// }

// export abstract class BaseController<T extends BaseEntity, CreateDto, QueryDto> {
//   protected abstract entityName: string;

//   constructor(protected readonly service: BaseService<T>) {}


//   // @Post()
//   // @ApiOperation({ summary: '创建' })
//   // create(@Body() createDto: CreateDto, @Req() req: Request) {
//   //   return this.service.create(createDto, req);
//   // }

// } 