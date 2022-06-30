import { Module } from '@nestjs/common';
import { DpMetaEntityService } from './dpMetaEntity.service';
import { DpMetaEntityController } from './dpMetaEntity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpMetaEntity } from './dpMetaEntity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DpMetaEntity])],
  controllers: [DpMetaEntityController],
  providers: [DpMetaEntityService],
  exports:[DpMetaEntityService]
})
export class DpMetaEntityModule { }