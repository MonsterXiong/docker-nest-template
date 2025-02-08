import { Controller } from '@nestjs/common';
import { DpProjectExtendService } from './dpProjectExtend.service';

@Controller('dp-project-extend')
export class DpProjectExtendController {
  constructor(
    private readonly dpProjectExtendService: DpProjectExtendService,
  ) {}
}
