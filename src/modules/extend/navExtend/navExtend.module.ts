import { Module, forwardRef } from '@nestjs/common';
// import { Nav } from '../../base/nav/nav.entity';
// import { NavExtendService } from './navExtend.service';
// import { NavModule } from '../../base/nav/nav.module';
// import { SCategoryModule } from '../../base/sCategory/sCategory.module';
// import { NavExtendController } from './navExtend.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // TypeOrmModule.forFeature([Nav]),
    // SCategoryModule,
    // NavModule,
  ],
  // controllers: [NavExtendController],
  // providers: [NavExtendService],
  // exports: [NavExtendService],
})
export class NavExtendModule {}
