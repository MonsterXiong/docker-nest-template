import { Controller } from '@nestjs/common';
import { GitlabService } from './gitlab.service';

@Controller('gitlab')
export class GitlabController {
  constructor(private readonly gitlabService: GitlabService) {}
}
