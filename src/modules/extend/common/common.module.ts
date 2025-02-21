import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { BootstrapModule } from '../bootstrap/bootstrap.module';
import { DpTemplateExtendModule } from '../dpTemplateExtend/dpTemplateExtend.module';
import { DpProjectExtendModule } from '../dpProjectExtend/dpProjectExtend.module';

@Module({
  imports:[BootstrapModule,DpTemplateExtendModule,DpProjectExtendModule],
  controllers: [CommonController],
  providers: [CommonService],
  exports:[CommonService]
})
export class CommonModule {}
