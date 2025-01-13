import { Module } from '@nestjs/common';
import { DpProjectInfoService } from './dpProjectInfo.service';
import { DpProjectInfoController } from './dpProjectInfo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpProjectInfo } from './dpProjectInfo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DpProjectInfo])],
  controllers: [DpProjectInfoController],
  providers: [DpProjectInfoService],
  exports:[DpProjectInfoService]
})
export class DpProjectInfoModule { }