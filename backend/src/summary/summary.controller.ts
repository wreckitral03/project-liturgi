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
}
