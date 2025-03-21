import { Module } from '@nestjs/common';
import { DpMetaDatabaseService } from './dpMetaDatabase.service';
import { DpMetaDatabaseController } from './dpMetaDatabase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpMetaDatabase } from './dpMetaDatabase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DpMetaDatabase])],
  controllers: [DpMetaDatabaseController],
  providers: [DpMetaDatabaseService],
  exports:[DpMetaDatabaseService,TypeOrmModule.forFeature([DpMetaDatabase])]
})
export class DpMetaDatabaseModule { }