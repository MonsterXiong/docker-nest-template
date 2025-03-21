import { Module } from '@nestjs/common';
import { DpEdgeService } from './dpEdge.service';
import { DpEdgeController } from './dpEdge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpEdge } from './dpEdge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DpEdge])],
  controllers: [DpEdgeController],
  providers: [DpEdgeService],
  exports:[DpEdgeService,TypeOrmModule.forFeature([DpEdge])]
})
export class DpEdgeModule { }