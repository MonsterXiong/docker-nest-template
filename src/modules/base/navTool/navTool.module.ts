import { Module } from '@nestjs/common';
import { NavToolService } from './navTool.service';
import { NavToolController } from './navTool.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NavTool } from './navTool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NavTool])],
  controllers: [NavToolController],
  providers: [NavToolService],
  exports:[NavToolService]
})
export class NavToolModule { }