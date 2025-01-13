import { Module } from '@nestjs/common';
import { SCategoryTypeService } from './sCategoryType.service';
import { SCategoryTypeController } from './sCategoryType.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SCategoryType } from './sCategoryType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SCategoryType])],
  controllers: [SCategoryTypeController],
  providers: [SCategoryTypeService],
  exports:[SCategoryTypeService]
})
export class SCategoryTypeModule { }