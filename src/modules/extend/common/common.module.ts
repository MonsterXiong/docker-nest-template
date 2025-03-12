import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { BootstrapModule } from '../bootstrap/bootstrap.module';
import { DpTemplateExtendModule } from '../dpTemplateExtend/dpTemplateExtend.module';
import { DpTemplatePromptModule } from 'src/modules/base/dpTemplatePrompt';

@Module({
  imports:[BootstrapModule,DpTemplateExtendModule,DpTemplatePromptModule],
  controllers: [CommonController],
  providers: [CommonService],
  exports:[CommonService]
})
export class CommonModule {}
