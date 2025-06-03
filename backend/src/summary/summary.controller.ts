import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { SummaryService } from './summary.service';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get('daily')
  getSummary(@Query('date') date: string) {
    return this.summaryService.getSummary(date);
  }

  @Post('daily')
  createSummary(@Body() body: { date: string; summary: string; checklist: any }) {
    return this.summaryService.createSummary(body.date, body.summary, body.checklist);
  }

  @Get('checklist-status')
  getChecklistStatus(@Query('date') date: string, @Query('userId') userId: string) {
    return this.summaryService.getChecklistStatus(date, userId);
  }

  @Post('checklist-status')
  updateChecklistStatus(
    @Body() body: { date: string; userId: string; checklist: any }
  ) {
    return this.summaryService.updateChecklistStatus(body.date, body.userId, body.checklist);
  }
}
