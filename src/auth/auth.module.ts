import { UserModule } from './../controller/user/user.module';
import { JwtAccessStrategy } from './jwt-access.strategy';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserService } from 'src/controller/user/user.service';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.TOKEN_SECRET,
        signOptions: {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,

    {
      provide: APP_GUARD,
      useClass: JwtAccessStrategy,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
