import { Module } from '@nestjs/common';
import { DpTemplateService } from './dpTemplate.service';
import { DpTemplateController } from './dpTemplate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpTemplate } from './dpTemplate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DpTemplate])],
  controllers: [DpTemplateController],
  providers: [DpTemplateService],
  exports:[DpTemplateService,TypeOrmModule.forFeature([DpTemplate])]
})
export class DpTemplateModule { }