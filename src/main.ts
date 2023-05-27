import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

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
  const config = new ConfigService();
  app.enableCors(corsOptions);
  await app.listen(await config.getPortConfig());
}
bootstrap();
