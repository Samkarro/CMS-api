import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationExceptionFilter } from './common/exceptions/validator.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ValidationExceptionFilter());
  await app.listen(3000);
}
bootstrap();
