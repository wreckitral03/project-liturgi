import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SummaryService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(date: string) {
    // Example implementation
    return this.prisma.summary.findUnique({
      where: { date },
    });
  }

  async createSummary(date: string, summary: string, checklist: any) {
    return this.prisma.summary.create({
      data: {
        date,
        summary,
        checklist,
      },
    });
  }
}
