
import { Controller, Get, Query } from '@nestjs/common';
import { ReadingsService } from './readings.service';

@Controller('readings')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Get('daily')
  getReading(@Query('date') date: string) {
    return this.readingsService.getReading(date);
  }
}
