import { Module } from '@nestjs/common';
import { DpMenuService } from './dpMenu.service';
import { DpMenuController } from './dpMenu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpMenu } from './dpMenu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DpMenu])],
  controllers: [DpMenuController],
  providers: [DpMenuService],
  exports:[DpMenuService,TypeOrmModule.forFeature([DpMenu])]
})
export class DpMenuModule { }