import { Module } from '@nestjs/common';
import { DpTemplatePromptService } from './dpTemplatePrompt.service';
import { DpTemplatePromptController } from './dpTemplatePrompt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpTemplatePrompt } from './dpTemplatePrompt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DpTemplatePrompt])],
  controllers: [DpTemplatePromptController],
  providers: [DpTemplatePromptService],
  exports:[DpTemplatePromptService,TypeOrmModule.forFeature([DpTemplatePrompt])]
})
export class DpTemplatePromptModule { }