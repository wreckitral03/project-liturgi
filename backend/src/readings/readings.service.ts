import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReadingsService {
  constructor(private prisma: PrismaService) {}

  async getReading(date: string) {
    const reading = await this.prisma.reading.findUnique({
      where: { date },
    });

    if (!reading) return null;

    return {
      date: reading.date,
      firstReading: {
        reference: reading.firstReference,
        content: reading.firstContent,
      },
      psalm: {
        reference: reading.psalmReference,
        content: reading.psalmContent,
      },
      secondReading: reading.secondReference && reading.secondContent
        ? {
            reference: reading.secondReference,
            content: reading.secondContent,
          }
        : null,
      gospel: {
        reference: reading.gospelReference,
        content: reading.gospelContent,
      },
    };
  }
}
