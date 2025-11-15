import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/logging.interceptor';
import { HttpErrorFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpErrorFilter());
  await app.listen(3000);
}
bootstrap();
