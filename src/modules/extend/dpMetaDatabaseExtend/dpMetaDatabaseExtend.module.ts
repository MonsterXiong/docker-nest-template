import { Module } from '@nestjs/common';
import { DpMetaDatabaseExtendService } from './dpMetaDatabaseExtend.service';
import { DpMetaDatabaseExtendController } from './dpMetaDatabaseExtend.controller';
import { DpMetaDatabaseModule } from 'src/modules/base/dpMetaDatabase';
import { DpMetaEntityAttrModule } from 'src/modules/base/dpMetaEntityAttr';
import { DpMetaEntityModule } from 'src/modules/base/dpMetaEntity';
import { CommonModule } from '../common/common.module';
import { DpMetaEnumModule } from 'src/modules/base/dpMetaEnum';

@Module({
  imports:[DpMetaDatabaseModule,DpMetaEntityAttrModule,DpMetaEntityModule,CommonModule,DpMetaEnumModule],
  controllers: [DpMetaDatabaseExtendController],
  providers: [DpMetaDatabaseExtendService],
  exports:[DpMetaDatabaseExtendService]
})
export class DpMetaDatabaseExtendModule {}  
