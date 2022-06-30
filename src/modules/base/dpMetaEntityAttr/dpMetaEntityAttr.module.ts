import { Module } from '@nestjs/common';
import { DpMetaEntityAttrService } from './dpMetaEntityAttr.service';
import { DpMetaEntityAttrController } from './dpMetaEntityAttr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpMetaEntityAttr } from './dpMetaEntityAttr.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DpMetaEntityAttr])],
  controllers: [DpMetaEntityAttrController],
  providers: [DpMetaEntityAttrService],
  exports:[DpMetaEntityAttrService]
})
export class DpMetaEntityAttrModule { }