import { Module } from '@nestjs/common';
import { DpGenService } from './dpGen.service';
import { DpGenController } from './dpGen.controller';
import { DpProjectModule } from 'src/modules/base/dpProject/dpProject.module';
import { DpProjectInfoModule } from 'src/modules/base/dpProjectInfo';
import { DbModule } from '../db';
import { DpTemplateModule } from 'src/modules/base/dpTemplate';
import { DpEnvConfigModule } from 'src/modules/base/dpEnvConfig';
import { CommonModule } from 'src/modules/extend/common/common.module';
import { DpMenuExtendModule } from '../dpMenuExtend/dpMenuExtend.module';
import { DpProjectExtendModule } from '../dpProjectExtend/dpProjectExtend.module';
import { DpTemplateExtendModule } from '../dpTemplateExtend/dpTemplateExtend.module';
@Module({
  imports:[
    DpProjectModule,
    DpProjectInfoModule,
    DbModule,
    DpEnvConfigModule,
    DpTemplateModule,
    CommonModule,
    DpMenuExtendModule,
    DpProjectExtendModule,
    DpTemplateExtendModule
  ],
  controllers: [DpGenController],
  providers: [DpGenService],
  exports:[DpGenService]
})
export class DpGenModule {}
