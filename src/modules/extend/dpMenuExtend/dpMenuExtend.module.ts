import { forwardRef, Module } from '@nestjs/common';
import { DpMenuExtendService } from './dpMenuExtend.service';
import { DpMenuExtendController } from './dpMenuExtend.controller';
import { DpMenuModule } from 'src/modules/base/dpMenu';
import { DpMenuDetailModule } from 'src/modules/base/dpMenuDetail';
import { DpProjectExtendModule } from '../dpProjectExtend/dpProjectExtend.module';
import { CommonModule } from '../common/common.module';
import { DpGenModule } from '../dpGen/dpGen.module';

@Module({
  imports:[DpMenuModule,DpMenuDetailModule,CommonModule,forwardRef(()=>DpProjectExtendModule)],
  controllers: [DpMenuExtendController],
  providers: [DpMenuExtendService],
  exports:[DpMenuExtendService]
})
export class DpMenuExtendModule {}