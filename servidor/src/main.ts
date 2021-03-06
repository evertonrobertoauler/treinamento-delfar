import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'minha-chave-secreta',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.enableCors({ origin: 'http://localhost:4200', credentials: true });

  await app.listen(3000);
}

bootstrap();
