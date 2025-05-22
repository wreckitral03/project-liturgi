import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('message')
  async handleMessage(@Body('message') message: string, @Request() req) {
    const userId = req.user?.id || 'demo-user';
    return this.aiService.getAIResponse(message, userId);
  }

  // @Post()
  // receiveAIResponse(@Body() body: any) {
  //   return this.aiService.saveResponse(body);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getChatHistory(@Request() req) {
    const userId = req.user?.id || 'demo-user';
    return this.aiService.getUserChatHistory(userId);
  }
}
