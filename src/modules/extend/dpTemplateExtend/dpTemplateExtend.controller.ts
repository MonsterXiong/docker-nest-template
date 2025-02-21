import { Controller } from '@nestjs/common';
import { DpTemplateExtendService } from './dpTemplateExtend.service';

@Controller('dp-template-extend')
export class DpTemplateExtendController {
  constructor(private readonly dpTemplateExtendService: DpTemplateExtendService) {}
}
