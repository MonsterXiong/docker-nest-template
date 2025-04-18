import { Module } from '@nestjs/common';
import { DocService } from './doc.service';
import { DocController } from './doc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doc } from './doc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doc])],
  controllers: [DocController],
  providers: [DocService],
  exports:[DocService,TypeOrmModule.forFeature([Doc])]
})
export class DocModule { }