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

    // Generate mock AI response
    const aiResponse = {
      isUser: false,
      text: 'Saya mendengar bahwa kamu sedang menghadapi situasi yang sulit. Tetaplah kuat dalam iman dan percaya bahwa Tuhan selalu menyertai kamu. Berikut ayat yang mungkin dapat menguatkan kamu:',
      verse: {
        reference: 'Filipi 4:13',
        text: 'Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.',
      },
    };

    // Save AI response
    await this.prisma.chatMessage.create({
      data: {
        userId,
        isUser: false,
        text: aiResponse.text,
        verseReference: aiResponse.verse.reference,
        verseText: aiResponse.verse.text,
      },
    });

    return aiResponse;
  }

  async getUserChatHistory(userId: string) {
    const messages = await this.prisma.chatMessage.findMany({
      where: { userId },
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
