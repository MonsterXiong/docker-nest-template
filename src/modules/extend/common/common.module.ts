import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { BootstrapModule } from '../bootstrap/bootstrap.module';
import { DpTemplateModule } from 'src/modules/base/dpTemplate';

@Module({
  controllers: [CommonController],
  providers: [CommonService],
  imports:[BootstrapModule,DpTemplateModule],
  exports:[CommonService]
})
export class CommonModule {}
