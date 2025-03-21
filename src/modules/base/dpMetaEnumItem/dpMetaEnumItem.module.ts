import { Module } from '@nestjs/common';
import { DpMetaEnumItemService } from './dpMetaEnumItem.service';
import { DpMetaEnumItemController } from './dpMetaEnumItem.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpMetaEnumItem } from './dpMetaEnumItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DpMetaEnumItem])],
  controllers: [DpMetaEnumItemController],
  providers: [DpMetaEnumItemService],
  exports:[DpMetaEnumItemService,TypeOrmModule.forFeature([DpMetaEnumItem])]
})
export class DpMetaEnumItemModule { }