import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GLOBAL_PREFIX } from '@constants';
import { ResponseInterceptor } from '@base/interceptors/response.interceptor';
import { AllExceptionsFilter } from '@base/filters/all-exceptions.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configService = new ConfigService();
  const logger = new Logger('NestApplication');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(GLOBAL_PREFIX);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      validateCustomDecorators: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Kahoot')
    .setDescription('Kahoot API description')
    .setVersion('1.0')
    .addTag('Kahoot')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(configService.get('APP_PORT') || 3000, '0.0.0.0');
  logger.log(`Nest application is running on: ${await app.getUrl()}`);
}
bootstrap();
