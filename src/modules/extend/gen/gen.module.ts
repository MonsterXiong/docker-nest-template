import { Module } from '@nestjs/common';
import { GenService } from './gen.service';
import { GenController } from './gen.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [GenController],
  providers: [GenService],
})
export class GenModule {}
