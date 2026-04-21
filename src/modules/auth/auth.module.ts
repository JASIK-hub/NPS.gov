import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { RedisModule } from 'src/core/db/redis.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { OtpService } from './services/otp.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_KEYS } from 'src/core/config/env-keys';

@Module({
  imports: [
    UserModule,
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(ENV_KEYS.JWT_SECRET),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [TokenService, AuthService, OtpService],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
