import { Module, forwardRef } from '@nestjs/common';
import { Nav } from '../../base/nav/nav.entity';
import { NavUrl } from '../../base/navUrl/navUrl.entity';
import { NavExtendService } from './navExtend.service';
import { NavModule } from '../../base/nav/nav.module';
import { NavToolModule } from '../../base/navTool/navTool.module';
import { NavUrlModule } from '../../base/navUrl/navUrl.module';
import { SCategoryModule } from '../../base/sCategory/sCategory.module';
import { NavExtendController } from './navExtend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nav, NavUrl]),
    SCategoryModule,
    NavToolModule,
    NavModule,
    NavUrlModule,
  ],
  controllers: [NavExtendController],
  providers: [NavExtendService],
  exports: [NavExtendService],
})
export class NavExtendModule {}
