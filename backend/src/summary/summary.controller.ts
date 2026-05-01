import { Controller, Get, Post, Put, Body, Query, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { SummaryService, UserChecklistStatusResponse } from './summary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get('daily')
  getSummary(@Query('date') date?: string) {
    return this.summaryService.getSummary(date);
  }

  @UseGuards(JwtAuthGuard)
  @Post('daily')
  createSummary(@Body() body: { date: string; summary: string; checklist: any }, @Request() req) {
    if (req.user?.role !== 'CONTRIBUTOR') {
      throw new ForbiddenException('Contributor role is required');
    }

    return this.summaryService.createSummary(body.date, body.summary, body.checklist);
  }

  /**
   * Get user-specific checklist status for today's summary
   */
  @UseGuards(JwtAuthGuard)
  @Get('checklist/:date')
  async getUserChecklistStatus(
    @Param('date') date: string,
    @Request() req
  ): Promise<UserChecklistStatusResponse> {
    const userId = req.user?.id;
    return this.summaryService.getUserChecklistStatus(userId, date);
  }

  /**
   * Update a specific checklist item by index
   */
  @UseGuards(JwtAuthGuard)
  @Put('checklist/:summaryId/item/:itemIndex')
  async updateChecklistItem(
    @Param('summaryId') summaryId: string,
    @Param('itemIndex') itemIndex: string,
    @Body('completed') completed: boolean,
    @Request() req
  ): Promise<UserChecklistStatusResponse> {
    const userId = req.user?.id;
    return this.summaryService.updateUserChecklistItem(
      userId,
      summaryId,
      parseInt(itemIndex),
      completed
    );
  }

  /**
   * Update a specific checklist item by text
   */
  @UseGuards(JwtAuthGuard)
  @Put('checklist/:summaryId/item')
  async updateChecklistItemByText(
    @Param('summaryId') summaryId: string,
    @Body('itemText') itemText: string,
    @Body('completed') completed: boolean,
    @Request() req
  ): Promise<UserChecklistStatusResponse> {
    const userId = req.user?.id;
    return this.summaryService.updateUserChecklistItemByText(
      userId,
      summaryId,
      itemText,
      completed
    );
  }
}
