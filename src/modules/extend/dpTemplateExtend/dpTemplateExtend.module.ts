import {  Module } from '@nestjs/common';
import { DpTemplateExtendService } from './dpTemplateExtend.service';
import { DpTemplateExtendController } from './dpTemplateExtend.controller';
import { DpTemplateModule } from 'src/modules/base/dpTemplate';

@Module({
  imports:[DpTemplateModule],
  controllers: [DpTemplateExtendController],
  providers: [DpTemplateExtendService],
  exports:[DpTemplateExtendService]
})
export class DpTemplateExtendModule {}
