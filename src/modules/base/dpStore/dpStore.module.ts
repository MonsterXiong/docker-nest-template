import { Module } from '@nestjs/common';
import { DpStoreService } from './dpStore.service';
import { DpStoreController } from './dpStore.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpStore } from './dpStore.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DpStore])],
  controllers: [DpStoreController],
  providers: [DpStoreService],
  exports:[DpStoreService]
})
export class DpStoreModule { }