import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfig } from './core/config/swagger.config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const app_url=process.env.APP_URL
  app.enableCors({
    origin:app_url,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        console.log('Validation errors:', errors);
        const messages = errors.map(error => ({
          field: error.property,
          constraints: error.constraints,
          value: error.value,
        }));
        console.log('Detailed validation errors:', JSON.stringify(messages, null, 2));
        return new Error(`Validation failed: ${JSON.stringify(messages)}`);
      },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());

  SwaggerConfig(app);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
