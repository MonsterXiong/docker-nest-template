import { Controller } from '@nestjs/common';
import { BootstrapService } from './bootstrap.service';

@Controller('bootstrap')
export class BootstrapController {
  constructor(private readonly bootstrapService: BootstrapService) {}
  
}
