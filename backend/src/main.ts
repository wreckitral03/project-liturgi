
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Fix CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:8081',
      'http://localhost:3000', 
      'http://192.168.103.64:8081',
      'http://127.0.0.1:8081'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
