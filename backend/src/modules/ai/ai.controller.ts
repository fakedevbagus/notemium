import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('summarize')
  summarize(@Body('content') content: string) {
    return this.aiService.summarize(content);
  }

  @Post('rewrite')
  rewrite(@Body('content') content: string) {
    return this.aiService.rewrite(content);
  }

  @Post('auto-tag')
  autoTag(@Body('content') content: string) {
    return this.aiService.autoTag(content);
  }

  @Post('semantic-search')
  semanticSearch(@Body('query') query: string) {
    return this.aiService.semanticSearch(query);
  }
}
