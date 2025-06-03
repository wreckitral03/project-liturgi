import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface ChecklistItem {
  text: string;
  completed: boolean;
}

export interface UserChecklistStatusResponse {
  id: string;
  summaryId: string;
  userId: string;
  checklist: ChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class SummaryService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(date: string) {
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

  /**
   * Get or create user-specific checklist status for today's summary
   */
  async getUserChecklistStatus(userId: string, date: string): Promise<UserChecklistStatusResponse> {
    // First, get the summary for the date
    const summary = await this.prisma.summary.findUnique({
      where: { date },
    });

    if (!summary) {
      throw new NotFoundException(`Summary not found for date: ${date}`);
    }

    // Try to find existing user checklist status
    let userChecklistStatus = await this.prisma.summaryChecklistStatus.findUnique({
      where: {
        summaryId_userId: {
          summaryId: summary.id,
          userId: userId,
        },
      },
    });

    // If not found, create a new one with all items marked as incomplete
    if (!userChecklistStatus) {
      const defaultChecklist = (summary.checklist as unknown as ChecklistItem[]).map(item => ({
        text: item.text,
        completed: false, // All items start as incomplete for new users
      }));

      userChecklistStatus = await this.prisma.summaryChecklistStatus.create({
        data: {
          summaryId: summary.id,
          userId: userId,
          checklist: defaultChecklist as any,
        },
      });
    }

    return {
      id: userChecklistStatus.id,
      summaryId: userChecklistStatus.summaryId,
      userId: userChecklistStatus.userId,
      checklist: userChecklistStatus.checklist as unknown as ChecklistItem[],
      createdAt: userChecklistStatus.createdAt,
      updatedAt: userChecklistStatus.updatedAt,
    };
  }

  async updateUserChecklistItem(
    userId: string,
    summaryId: string,
    itemIndex: number,
    completed: boolean
  ): Promise<UserChecklistStatusResponse> {
    // Get the current user checklist status
    const userChecklistStatus = await this.prisma.summaryChecklistStatus.findUnique({
      where: {
        summaryId_userId: {
          summaryId: summaryId,
          userId: userId,
        },
      },
    });

    if (!userChecklistStatus) {
      throw new NotFoundException('User checklist status not found');
    }

    const checklist = userChecklistStatus.checklist as unknown as ChecklistItem[];
    
    // Validate item index
    if (itemIndex < 0 || itemIndex >= checklist.length) {
      throw new Error('Invalid checklist item index');
    }

    // Update only the specific item
    checklist[itemIndex].completed = completed;

    // Save the updated checklist
    const updatedStatus = await this.prisma.summaryChecklistStatus.update({
      where: {
        summaryId_userId: {
          summaryId: summaryId,
          userId: userId,
        },
      },
      data: {
        checklist: checklist as any,
      },
    });

    return {
      id: updatedStatus.id,
      summaryId: updatedStatus.summaryId,
      userId: updatedStatus.userId,
      checklist: updatedStatus.checklist as unknown as ChecklistItem[],
      createdAt: updatedStatus.createdAt,
      updatedAt: updatedStatus.updatedAt,
    };
  }

  async updateUserChecklistItemByText(
    userId: string,
    summaryId: string,
    itemText: string,
    completed: boolean
  ): Promise<UserChecklistStatusResponse> {
    const userChecklistStatus = await this.prisma.summaryChecklistStatus.findUnique({
      where: {
        summaryId_userId: {
          summaryId: summaryId,
          userId: userId,
        },
      },
    });

    if (!userChecklistStatus) {
      throw new NotFoundException('User checklist status not found');
    }

    const checklist = userChecklistStatus.checklist as unknown as ChecklistItem[];
    const itemIndex = checklist.findIndex(item => item.text === itemText);
    
    if (itemIndex === -1) {
      throw new Error('Checklist item not found');
    }

    // Update only the specific item
    checklist[itemIndex].completed = completed;

    const updatedStatus = await this.prisma.summaryChecklistStatus.update({
      where: {
        summaryId_userId: {
          summaryId: summaryId,
          userId: userId,
        },
      },
      data: {
        checklist: checklist as any,
      },
    });

    return {
      id: updatedStatus.id,
      summaryId: updatedStatus.summaryId,
      userId: updatedStatus.userId,
      checklist: updatedStatus.checklist as unknown as ChecklistItem[],
      createdAt: updatedStatus.createdAt,
      updatedAt: updatedStatus.updatedAt,
    };
  }
}
