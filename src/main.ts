import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('CMS REST API')
    .setDescription('Simple cms api')
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'Local environment')
    .addTag('Articles')
    .addTag('Users')
    .addTag('Categories')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, documentFactory);
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
