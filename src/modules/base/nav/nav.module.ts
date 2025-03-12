import { Module } from '@nestjs/common';
import { NavService } from './nav.service';
import { NavController } from './nav.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nav } from './nav.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nav])],
  controllers: [NavController],
  providers: [NavService],
  exports:[NavService,TypeOrmModule.forFeature([Nav])]
})
export class NavModule { }