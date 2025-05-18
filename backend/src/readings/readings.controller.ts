
import { Controller, Get, Param } from '@nestjs/common';
import { ReadingsService } from './readings.service';

@Controller('readings')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Get(':date')
  getReading(@Param('date') date: string) {
    return this.readingsService.getReading(date);
  }
}
