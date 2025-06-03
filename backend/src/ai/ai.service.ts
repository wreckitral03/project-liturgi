import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async getAIResponse(message: string, userId: string) {
    console.log('AI service called with message:', message);
    // Save user message
    await this.prisma.chatMessage.create({
      data: {
        userId,
        isUser: true,
        text: message,
      },
    });

    // Generate mock AI response
  //  const aiResponse = {
    //  isUser: false,
      //text: 'Saya mendengar bahwa kamu sedang menghadapi situasi yang sulit. Tetaplah kuat dalam iman dan percaya bahwa Tuhan selalu menyertai kamu. Berikut ayat yang mungkin dapat menguatkan kamu:',
      //verse: {
        //reference: 'Filipi 4:13',
        //text: 'Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.',
      //},
    //};

    // Call N8N webhook
  const webhookUrl = 'http://localhost:5678/webhook/7bf1540a-d3ba-429e-bf4e-b7ec5387c543';
  try {
    const n8nRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!n8nRes.ok) {
      throw new Error(`N8N webhook error: ${n8nRes.status} ${n8nRes.statusText}`);
    }
    const aiResponse = await n8nRes.json();
    console.log('AI response from N8N:', aiResponse); // Add this line for debugging purpo
    
    const ai = Array.isArray(aiResponse) ? aiResponse[0] : aiResponse;

    console.log('AI response from N8N:', ai); // Add this line for debugging purposes
    // Save AI response
    await this.prisma.chatMessage.create({
      data: {
        userId,
        isUser: false,
<<<<<<< HEAD
        text: ai.text,
        verseReference: ai.verse?.reference,
        verseText: ai.verse?.text,
      },
    });
    return ai;
    console.log('AI response:', aiResponse);
  } catch (err) {
    console.error('AI webhook error:', err);
  
    // Prepare fallback AI response
    const fallback = {
      isUser: false,
      text: 'Mohon maaf, ada kesalahan teknis. Silakan coba lagi nanti.',
      verse: null,
    };
  
    // Save fallback response to DB
    await this.prisma.chatMessage.create({
      data: {
        userId,
        isUser: false,
        text: fallback.text,
        verseReference: null,
        verseText: null,
      },
    });
  
    // Return fallback
    return fallback;
=======
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
>>>>>>> c88311e (🔁 Sunday update: Connect BibleContext to backend, switch from mock API to real API)
  }
}

async getUserChatHistory(userId: string) {
  const records = await this.prisma.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });

  // Map the DB records to the expected frontend format
  return records.map(msg => ({
    id: msg.id,
    isUser: msg.isUser,
    text: msg.text,
    createdAt: msg.createdAt,
    // Only add "verse" if both fields are present
    ...(msg.verseReference && msg.verseText
      ? { verse: { reference: msg.verseReference, text: msg.verseText } }
      : {}),
  }));
}
}
