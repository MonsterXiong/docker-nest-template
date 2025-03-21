import { Module } from '@nestjs/common';
import { DpNodeService } from './dpNode.service';
import { DpNodeController } from './dpNode.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpNode } from './dpNode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DpNode])],
  controllers: [DpNodeController],
  providers: [DpNodeService],
  exports:[DpNodeService,TypeOrmModule.forFeature([DpNode])]
})
export class DpNodeModule { }