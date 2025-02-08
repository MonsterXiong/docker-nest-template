import { Module } from '@nestjs/common';
import { PageGenService } from './page-gen.service';
import { PageGenController } from './page-gen.controller';
import { DpTemplateModule } from 'src/modules/base/dpTemplate';
import { DpProjectExtendModule } from '../dpProjectExtend/dpProjectExtend.module';

@Module({
  imports: [DpTemplateModule, DpProjectExtendModule],
  controllers: [PageGenController],
  providers: [PageGenService],
  exports: [PageGenService],
})
export class PageGenModule {}
