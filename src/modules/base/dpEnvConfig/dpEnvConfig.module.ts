import { Module } from '@nestjs/common';
import { DpEnvConfigService } from './dpEnvConfig.service';
import { DpEnvConfigController } from './dpEnvConfig.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpEnvConfig } from './dpEnvConfig.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DpEnvConfig])],
  controllers: [DpEnvConfigController],
  providers: [DpEnvConfigService],
  exports:[DpEnvConfigService,TypeOrmModule.forFeature([DpEnvConfig])]
})
export class DpEnvConfigModule { }