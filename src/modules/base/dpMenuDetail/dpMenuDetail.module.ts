import { Module } from '@nestjs/common';
import { DpMenuDetailService } from './dpMenuDetail.service';
import { DpMenuDetailController } from './dpMenuDetail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpMenuDetail } from './dpMenuDetail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DpMenuDetail])],
  controllers: [DpMenuDetailController],
  providers: [DpMenuDetailService],
  exports:[DpMenuDetailService,TypeOrmModule.forFeature([DpMenuDetail])]
})
export class DpMenuDetailModule { }