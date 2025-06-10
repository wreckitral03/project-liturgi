import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  // Around line 64, modify the webhook call section:
  async getAIResponse(userId: string, message: string, userToken: string): Promise<any> {
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
  
  
    // Get the last user context for this user (if any)
    const lastUserContext = await this.prisma.userContext.findFirst({
      where: { 
        userId,
        context: { 
          not: null,
          // Add additional filtering to ensure it's the right format
          // This will effectively return null until AI fills it properly
        }
      },
      orderBy: { createdAt: 'desc' },
      select: {
        context: true
      }
    });
  
    // Get recent verse references (add this before the webhook call)
    const recentVerseReferences = await this.getRecentVerseReferences(userId, 14);
  
    // Call n8n webhook with simplified payload
    try {
      const requestPayload = {
        user_id: userId,
        message: message,
        ageRange: ageInfo.ageRange,
        context: {
          userAgeRange: ageInfo.ageRange,
          usercontext: lastUserContext?.context || null,
          recentVerseReferences: recentVerseReferences // Add this line
        }
      };
      console.log('Sending to n8n:', JSON.stringify(requestPayload, null, 2));
  
      // With your actual n8n webhook URL:
      // The fetch call already has the userToken in headers:
      const response = await fetch('http://localhost:5678/webhook/7bf1540a-d3ba-429e-bf4e-b7ec5387c543', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify(requestPayload),
      });
  
      if (!response.ok) {
        throw new Error(`n8n webhook failed: ${response.status}`);
      }
  
      // Add debugging to see what n8n actually returns
      const responseText = await response.text();
      console.log('n8n raw response:', responseText);
      console.log('n8n response status:', response.status);
      console.log('n8n response headers:', Object.fromEntries(response.headers.entries()));
  
      // Try to parse JSON, with fallback
      let aiResponse;
      try {
        if (responseText.trim() === '') {
          // Handle empty response from n8n
          console.log('n8n returned empty response, using default');
          aiResponse = {
            message: 'AI request processed successfully',
            status: 'success'
          };
        } else {
          aiResponse = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.error('Failed to parse n8n response as JSON:', parseError);
        console.error('Raw response was:', responseText);
        // Return a default response if JSON parsing fails
        aiResponse = {
          message: 'AI response received but could not parse JSON',
          error: 'JSON_PARSE_ERROR'
        };
      }
  
      // Save AI response
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
  
      // Check if usercontext field exists and is not null/empty
      if (responseData.usercontext && responseData.usercontext.trim() !== '') {
        // Create new UserContext entry
        await this.prisma.userContext.create({
          data: {
            userId,
            context: {
              text: responseData.usercontext,
            }
          }
        });
        
        console.log('UserContext created for user:', userId);
      }
  
      return aiResponse;
    } catch (error) {
      console.error('Error calling n8n webhook:', error);
      throw error;
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
  
  // Add this new method after the existing getChatHistory method
  async getRecentVerseReferences(userId: string, daysBack: number = 14): Promise<string[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
  
    const messages = await this.prisma.chatMessage.findMany({
      where: { 
        userId,
        verseReference: {
          not: null // Only get messages that have verse references
        },
        createdAt: {
          gte: cutoffDate
        }
      },
      select: {
        verseReference: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      distinct: ['verseReference'] // Avoid duplicates
    });
  
    return messages
      .map(msg => msg.verseReference)
      .filter(ref => ref !== null) as string[];
  }
  
  async createUserContext(userId: string, context: any) {
    try {
      const userContext = await this.prisma.userContext.create({
        data: {
          userId,
          context
        }
      });
      
      return {
        success: true,
        data: userContext
      };
    } catch (error) {
      console.error('Error creating user context:', error);
      throw error;
    }
  }
}
