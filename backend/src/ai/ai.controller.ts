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
    // Extract the Bearer token from the Authorization header
    const authHeader = req.headers.authorization;
    const userToken = authHeader?.replace('Bearer ', '') || '';
    
    return this.aiService.getAIResponse(userId, message, userToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getChatHistory(@Request() req) {
    const userId = req.user?.id || 'demo-user';
    return this.aiService.getUserChatHistory(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('user-context')
  async createUserContext(@Body() body, @Request() req) {
    const userId = req.user.id;
    const context = body.context;
    return this.aiService.createUserContext(userId, context);
  }

  // Keep this one for the n8n webhook
 
}
