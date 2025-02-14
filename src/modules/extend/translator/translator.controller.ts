import { Controller,Post, Query } from '@nestjs/common';
import { TranslatorService } from './translator.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('翻译')
@Controller('translator')
export class TranslatorController {
  constructor(private readonly translatorService: TranslatorService) {}
  
  @Post('getResult')
  @ApiOperation({ summary: '根据name进行翻译' })
  async getResult(@Query('name') name: string) {
    return this.translatorService.getResult(name)
  }
}
