import { Controller, Get, Query } from '@nestjs/common';
import { SummaryService } from './summary.service';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get('daily')
  getSummary(@Query('date') date: string) {
    return this.summaryService.getSummary(date);
  }
}
