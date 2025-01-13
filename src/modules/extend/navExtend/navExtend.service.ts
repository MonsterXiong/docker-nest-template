import { Injectable, Logger } from '@nestjs/common';
// import { NavService } from '../../base/nav/nav.service';
// import { SCategoryService } from '../../base/sCategory/sCategory.service';
// import { Nav } from 'src/modules/base/nav';
// import { SCategory } from 'src/modules/base/sCategory';
import { CategoryType } from 'src/enums/category.enum';
import { PreviewStatus } from 'src/enums/preview.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';



@Injectable()
export class NavExtendService {
  private readonly logger = new Logger(NavExtendService.name);

  constructor(
    // private readonly navService: NavService,
    // private readonly sCategoryService: SCategoryService,
    // @InjectRepository(Nav)
    // private readonly navRepository: Repository<Nav>,
  ) {}

  async getNavData() {
   
  }

}



