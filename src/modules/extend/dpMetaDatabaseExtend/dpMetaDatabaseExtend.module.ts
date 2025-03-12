import { Module } from '@nestjs/common';
import { DpMetaDatabaseExtendService } from './dpMetaDatabaseExtend.service';
import { DpMetaDatabaseExtendController } from './dpMetaDatabaseExtend.controller';
import { DpMetaDatabaseModule } from 'src/modules/base/dpMetaDatabase';
import { DpMetaEntityAttrModule } from 'src/modules/base/dpMetaEntityAttr';
import { DpMetaEntityModule } from 'src/modules/base/dpMetaEntity';
import { CommonModule } from '../common/common.module';

@Module({
  imports:[DpMetaDatabaseModule,DpMetaEntityAttrModule,DpMetaEntityModule,CommonModule],
  controllers: [DpMetaDatabaseExtendController],
  providers: [DpMetaDatabaseExtendService],
  exports:[DpMetaDatabaseExtendService]
})
export class DpMetaDatabaseExtendModule {}  
