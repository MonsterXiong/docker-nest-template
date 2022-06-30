import { Module } from '@nestjs/common';
import { DpMetaEnumService } from './dpMetaEnum.service';
import { DpMetaEnumController } from './dpMetaEnum.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpMetaEnum } from './dpMetaEnum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DpMetaEnum])],
  controllers: [DpMetaEnumController],
  providers: [DpMetaEnumService],
  exports:[DpMetaEnumService]
})
export class DpMetaEnumModule { }