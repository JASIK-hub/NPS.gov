import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export function SwaggerConfig(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('NPS.gov API')
    .setDescription('Api for NPS.gov backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'Authorization',
    )
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/docs', app, document, {
    customSiteTitle: 'NPS.gov API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
