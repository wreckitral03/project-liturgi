import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async getAIResponse(message: string, userId: string) {
    // Get user's age category from database
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { ageCategory: true }
    });
    
    // ADD THIS DEBUG LOG
    console.log('👤 User data:', { userId, ageCategory: user?.ageCategory });
    
    // Helper function to get age range info
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
  
    // Save user message
    await this.prisma.chatMessage.create({
      data: {
        userId,
        isUser: true,
        text: message,
      },
    });
  
    // Call n8n webhook with enhanced age context
    try {
      const requestPayload = {
        user_id: userId,
        message: message,
        ageCategory: ageInfo.category,
        ageRange: ageInfo.ageRange,
        representativeAge: ageInfo.representativeAge,
        context: {
          userAgeGroup: ageInfo.category,
          userAgeRange: ageInfo.ageRange,
          userAge: ageInfo.representativeAge
        }
      };
      console.log('🚀 Sending to n8n:', JSON.stringify(requestPayload, null, 2));
      
      const response = await fetch('http://localhost:5678/webhook/7bf1540a-d3ba-429e-bf4e-b7ec5387c543', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
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
