import { Module } from '@nestjs/common';
import { DpProjectService } from './dpProject.service';
import { DpProjectController } from './dpProject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpProject } from './dpProject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DpProject])],
  controllers: [DpProjectController],
  providers: [DpProjectService],
  exports:[DpProjectService,TypeOrmModule.forFeature([DpProject])]
})
export class DpProjectModule { }