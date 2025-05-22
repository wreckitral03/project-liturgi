import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 👈 import this
import { BibleModule } from './bible/bible.module';
import { ReadingsModule } from './readings/readings.module';
import { AiModule } from './ai/ai.module';
import { SummaryModule } from './summary/summary.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 👈 add this line
    BibleModule,
    ReadingsModule,
    AiModule,
    SummaryModule,
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}