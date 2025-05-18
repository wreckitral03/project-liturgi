
import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai-response')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post()
  receiveAIResponse(@Body() body: any) {
    return this.aiService.saveResponse(body);
  }
}
