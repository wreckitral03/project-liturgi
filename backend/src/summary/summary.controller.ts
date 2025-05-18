
import { Controller, Get, Param } from '@nestjs/common';
import { SummaryService } from './summary.service';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get(':date')
  getSummary(@Param('date') date: string) {
    return this.summaryService.getSummary(date);
  }
}
