import { Module } from '@nestjs/common';
import { DpProjectExtendService } from './dpProjectExtend.service';
import { DpProjectExtendController } from './dpProjectExtend.controller';
import { DpProjectModule } from 'src/modules/base/dpProject/dpProject.module';
import { DpProjectInfoModule } from 'src/modules/base/dpProjectInfo';
import { DbModule } from '../db';
import { DpTemplateModule } from 'src/modules/base/dpTemplate';
import { DpEnvConfigModule } from 'src/modules/base/dpEnvConfig';
import { CommonModule } from 'src/modules/extend/common/common.module';
import { DpMenuExtendModule } from '../dpMenuExtend/dpMenuExtend.module';
@Module({
  imports: [
    DpProjectModule,
    DpProjectInfoModule,
    DbModule,
    DpEnvConfigModule,
    DpTemplateModule,
    CommonModule,
    DpMenuExtendModule
  ],
  controllers: [DpProjectExtendController],
  providers: [DpProjectExtendService],
  exports: [DpProjectExtendService],
})
export class DpProjectExtendModule {}
