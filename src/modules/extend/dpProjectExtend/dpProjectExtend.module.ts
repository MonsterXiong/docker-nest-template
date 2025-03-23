import {  Module } from '@nestjs/common';
import { DpProjectExtendService } from './dpProjectExtend.service';
import { DpProjectExtendController } from './dpProjectExtend.controller';
import { DpProjectModule } from 'src/modules/base/dpProject/dpProject.module';
import { DpProjectInfoModule } from 'src/modules/base/dpProjectInfo';
import { DbModule } from '../db';
import { DpEnvConfigModule } from 'src/modules/base/dpEnvConfig';
import { DpMenuExtendModule } from '../dpMenuExtend/dpMenuExtend.module';
import { DpStoreModule } from 'src/modules/base/dpStore';
@Module({
  imports: [
    DpProjectModule,
    DpProjectInfoModule,
    DpStoreModule,
    DpEnvConfigModule,
    DbModule,
    DpMenuExtendModule,
  ],
  controllers: [DpProjectExtendController],
  providers: [DpProjectExtendService],
  exports: [DpProjectExtendService],
})
export class DpProjectExtendModule {}
