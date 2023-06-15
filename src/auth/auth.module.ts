import { AdminAccessStrategy } from './admin.strategy';
import { PartnerAccessStrategy } from './partner.strategy';
import { ClientAccessStrategy } from './client.strategy';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from './user.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get('ACCESS_TOKEN_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    ClientAccessStrategy,
    PartnerAccessStrategy,
    AdminAccessStrategy,
    UsersService,
  ],
  exports: [AuthService, UsersService],
})
export class AuthModule {}
