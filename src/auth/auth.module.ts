import { ClientAccessStrategy } from './client.strategy';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local-strategy';
import { UsersService } from './user.service';

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
  providers: [AuthService, ClientAccessStrategy, UsersService],
  exports: [AuthService, UsersService],
})
export class AuthModule {}
