import { Module } from '@nestjs/common';
import { DpProjectExtendService } from './dpProjectExtend.service';
import { DpProjectExtendController } from './dpProjectExtend.controller';
import { DpProjectModule } from 'src/modules/base/dpProject/dpProject.module';
import { DpProjectInfoModule } from 'src/modules/base/dpProjectInfo';
import { DpMenuDetailModule } from 'src/modules/base/dpMenuDetail';
import { DpMenuModule } from 'src/modules/base/dpMenu';
import { DbModule } from '../db';
@Module({
  imports: [
    DpProjectModule,
    DpProjectInfoModule,
    DpMenuDetailModule,
    DpMenuModule,
    DbModule
  ],
  controllers: [DpProjectExtendController],
  providers: [DpProjectExtendService],
  exports: [DpProjectExtendService],
})
export class DpProjectExtendModule {}
