import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AppModule } from './controller/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Cấu hình CORS
  const corsOptions: CorsOptions = {
    origin: '*', // Cho phép tất cả các tên miền
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
  };
  const configService = app.get<ConfigService>(ConfigService);
  const cookieName = configService.get<string>('COOKIE_SECRET');
  app.use(cookieParser(cookieName));
  // const config = new ConfigService();
  app.enableCors(corsOptions);
  await app.listen(3001);
}
bootstrap();
