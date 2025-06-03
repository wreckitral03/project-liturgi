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
    const newSummary = await this.prisma.summary.create({
      data: {
        date,
        summary,
        checklist,
      },
    });

    // Optional: initialize checklist status for all users
    // const users = await this.prisma.user.findMany();
    // for (const user of users) {
    //   await this.prisma.summaryChecklistStatus.create({
    //     data: {
    //       summaryId: newSummary.id,
    //       userId: user.id,
    //       checklist,
    //     },
    //   });
    // }

    return newSummary;
  }

  async getChecklistStatus(date: string, userId: string) {
    const summary = await this.prisma.summary.findUnique({ where: { date } });
    if (!summary) return null;

    return this.prisma.summaryChecklistStatus.findUnique({
      where: {
        summaryId_userId: {
          summaryId: summary.id,
          userId,
        },
      },
    });
  }

  async updateChecklistStatus(date: string, userId: string, checklist: any) {
    const summary = await this.prisma.summary.findUnique({ where: { date } });
    if (!summary) throw new Error('Summary not found');

    return this.prisma.summaryChecklistStatus.upsert({
      where: {
        summaryId_userId: {
          summaryId: summary.id,
          userId,
        },
      },
      update: { checklist },
      create: {
        summaryId: summary.id,
        userId,
        checklist,
      },
    });
  }
}
