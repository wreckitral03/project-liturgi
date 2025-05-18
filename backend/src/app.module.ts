
import { Module } from '@nestjs/common';
import { BibleModule } from './bible/bible.module';
import { ReadingsModule } from './readings/readings.module';
import { AiModule } from './ai/ai.module';
import { SummaryModule } from './summary/summary.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [BibleModule, ReadingsModule, AiModule, SummaryModule, PrismaModule],
})
export class AppModule {}
