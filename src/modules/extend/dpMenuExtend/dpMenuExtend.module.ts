import { Module } from '@nestjs/common';
import { DpMenuExtendService } from './dpMenuExtend.service';
import { DpMenuExtendController } from './dpMenuExtend.controller';
import { DpMenuModule } from 'src/modules/base/dpMenu';
import { DpMenuDetailModule } from 'src/modules/base/dpMenuDetail';

@Module({
  imports:[DpMenuModule,DpMenuDetailModule],
  controllers: [DpMenuExtendController],
  providers: [DpMenuExtendService],
  exports:[DpMenuExtendService]
})
export class DpMenuExtendModule {}