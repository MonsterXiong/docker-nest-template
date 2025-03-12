import { Module } from '@nestjs/common';
import { DpGenService } from './dpGen.service';
import { DpGenController } from './dpGen.controller';
import { DpTemplateModule } from 'src/modules/base/dpTemplate';
import { CommonModule } from 'src/modules/extend/common/common.module';
import { DpMenuExtendModule } from '../dpMenuExtend/dpMenuExtend.module';
import { DpProjectExtendModule } from '../dpProjectExtend/dpProjectExtend.module';
import { DpTemplateExtendModule } from '../dpTemplateExtend/dpTemplateExtend.module';
@Module({
  imports:[
    DpTemplateModule,
    CommonModule,
    DpMenuExtendModule,
    DpProjectExtendModule,
    DpTemplateExtendModule,
  ],
  controllers: [DpGenController],
  providers: [DpGenService],
  exports:[DpGenService]
})
export class DpGenModule {}
