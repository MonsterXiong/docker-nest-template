import { Module } from '@nestjs/common';
import { SCategoryService } from './sCategory.service';
import { SCategoryController } from './sCategory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SCategory } from './sCategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SCategory])],
  controllers: [SCategoryController],
  providers: [SCategoryService],
  exports:[SCategoryService]
})
export class SCategoryModule { }