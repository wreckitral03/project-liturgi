
import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  saveResponse(data: any) {
    console.log('Received AI response from n8n:', data);
    return { success: true, received: data };
  }
}
