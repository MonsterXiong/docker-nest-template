import { Module } from '@nestjs/common';
import { NavUrlService } from './navUrl.service';
import { NavUrlController } from './navUrl.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NavUrl } from './navUrl.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NavUrl])],
  controllers: [NavUrlController],
  providers: [NavUrlService],
  exports:[NavUrlService]
})
export class NavUrlModule { }