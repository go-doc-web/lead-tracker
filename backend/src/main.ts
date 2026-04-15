import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Lead Tracker API')
    .setDescription('The mini-CRM API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  app.enableCors();
  await app.listen(PORT ?? 3000);
  logger.log(`🚀 Application is running on: http://localhost:${PORT}/api`);
  logger.log(`📖 Swagger documentation: http://localhost:${PORT}/api/docs`);
}
bootstrap().catch((err) => {
  console.error('💥 Error during display startup:', err);
  process.exit(1); // Выходим с кодом ошибки, если не смогли запуститься
});
