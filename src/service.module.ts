import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { DpGenService } from './modules/extend/dpGen/dpGen.service';
import { DpGenModule } from './modules/extend/dpGen/dpGen.module';

@Module({
  imports: [DpGenModule],
  controllers: [ServiceController],
  providers: [],
  exports:[]
})
export class ServiceModule { }