import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async getAIResponse(userId: string, message: string, userToken: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { ageCategory: true },
    });

    const getAgeInfo = (ageCategory: string) => {
      switch (ageCategory) {
        case 'TEEN_YOUTH':
          return { category: 'TEEN_YOUTH', ageRange: '<17', representativeAge: 16 };
        case 'YOUNG_ADULT':
          return { category: 'YOUNG_ADULT', ageRange: '18-25', representativeAge: 22 };
        case 'ADULT':
          return { category: 'ADULT', ageRange: '26-59', representativeAge: 40 };
        case 'SENIOR':
          return { category: 'SENIOR', ageRange: '60+', representativeAge: 65 };
        default:
          return { category: 'YOUNG_ADULT', ageRange: '18-25', representativeAge: 22 };
      }
    };

    const ageInfo = getAgeInfo(user?.ageCategory || 'YOUNG_ADULT');

    await this.prisma.chatMessage.create({
      data: {
        userId,
        isUser: true,
        text: message,
      },
    });

    const lastUserContext = await this.prisma.userContext.findFirst({
      where: {
        userId,
        context: {
          not: null,
        },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        context: true,
      },
    });

    const recentVerseReferences = await this.getRecentVerseReferences(userId, 14);

    try {
      const requestPayload = {
        user_id: userId,
        message,
        ageRange: ageInfo.ageRange,
        context: {
          userAgeRange: ageInfo.ageRange,
          usercontext: lastUserContext?.context || null,
          recentVerseReferences,
        },
      };

      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error('N8N_WEBHOOK_URL environment variable is required');
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`n8n webhook failed: ${response.status}`);
      }

      const responseText = await response.text();
      let aiResponse;

      try {
        aiResponse = responseText.trim()
          ? JSON.parse(responseText)
          : {
              message: 'AI request processed successfully',
              status: 'success',
            };
      } catch (parseError) {
        console.error('Failed to parse n8n response as JSON:', parseError);
        aiResponse = {
          message: 'AI response received but could not parse JSON',
          error: 'JSON_PARSE_ERROR',
        };
      }

      const responseData = Array.isArray(aiResponse) ? aiResponse[0] : aiResponse;

      await this.prisma.chatMessage.create({
        data: {
          userId,
          isUser: false,
          text: responseData.text || 'AI response received',
          verseReference: responseData.verse?.reference || null,
          verseText: responseData.verse?.text || null,
        },
      });

      if (responseData.usercontext && responseData.usercontext.trim() !== '') {
        await this.prisma.userContext.create({
          data: {
            userId,
            context: {
              text: responseData.usercontext,
            },
          },
        });
      }

      return aiResponse;
    } catch (error) {
      console.error('Error calling n8n webhook');
      throw error;
    }
  }

  async getUserChatHistory(userId: string, daysBack: number = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    const messages = await this.prisma.chatMessage.findMany({
      where: {
        userId,
        createdAt: {
          gte: cutoffDate,
        },
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

  async getRecentVerseReferences(userId: string, daysBack: number = 14): Promise<string[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    const messages = await this.prisma.chatMessage.findMany({
      where: {
        userId,
        verseReference: {
          not: null,
        },
        createdAt: {
          gte: cutoffDate,
        },
      },
      select: {
        verseReference: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      distinct: ['verseReference'],
    });

    return messages
      .map((msg) => msg.verseReference)
      .filter((ref) => ref !== null) as string[];
  }

  async createUserContext(userId: string, context: any) {
    try {
      const userContext = await this.prisma.userContext.create({
        data: {
          userId,
          context,
        },
      });

      return {
        success: true,
        data: userContext,
      };
    } catch (error) {
      console.error('Error creating user context');
      throw error;
    }
  }
}
