import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async getAIResponse(message: string, userId: string) {
    // Save user message
    await this.prisma.chatMessage.create({
      data: {
        userId,
        isUser: true,
        text: message,
      },
    });

    // Call n8n webhook instead of mock response
    try {
      const response = await fetch('http://localhost:5678/webhook/7bf1540a-d3ba-429e-bf4e-b7ec5387c543', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const aiResponseData = await response.json();
      console.log('n8n response:', JSON.stringify(aiResponseData, null, 2)); // Debug log
      
      // Handle array response from n8n
      const responseItem = Array.isArray(aiResponseData) ? aiResponseData[0] : aiResponseData;
      
      // Structure the response to match your expected format
      const aiResponse = {
        isUser: false,
        text: responseItem?.text || responseItem?.message || 'Maaf, saya tidak dapat memberikan respons saat ini.',
        verse: responseItem?.verse || null,
      };

      // Save AI response
      await this.prisma.chatMessage.create({
        data: {
          userId,
          isUser: false,
          text: aiResponse.text,
          verseReference: aiResponse.verse?.reference || null,
          verseText: aiResponse.verse?.text || null,
        },
      });

      return aiResponse;
    } catch (error) {
      console.error('Error calling n8n webhook:', error);
      
      // Fallback response in case of error
      const fallbackResponse = {
        isUser: false,
        text: 'Maaf, saya mengalami kesulitan teknis. Silakan coba lagi nanti.',
        verse: null,
      };

      // Save fallback response
      await this.prisma.chatMessage.create({
        data: {
          userId,
          isUser: false,
          text: fallbackResponse.text,
          verseReference: null,
          verseText: null,
        },
      });

      return fallbackResponse;
    }
  }

  async getUserChatHistory(userId: string, daysBack: number = 7) {
    // Calculate date N days ago
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
  
    const messages = await this.prisma.chatMessage.findMany({
      where: { 
        userId,
        createdAt: {
          gte: cutoffDate
        }
      },
      orderBy: { createdAt: 'asc' },
    });
  
    return messages.map((msg) => ({
      ...msg,
      verse: msg.verseReference && msg.verseText
        ? {
            reference: msg.verseReference,
            text: msg.verseText,
          }
        : undefined,
    }));
  }
}
