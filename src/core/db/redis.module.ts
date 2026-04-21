import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ENV_KEYS } from '../config/env-keys';

export const RedisProvider: Provider = {
  provide: 'redis',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return new Redis({
      host: configService.get<string>(ENV_KEYS.REDIS_HOST),
      password: configService.get<string>(ENV_KEYS.REDIS_PASSWORD),
      port: Number(configService.get<string>(ENV_KEYS.REDIS_PORT)),
    });
  },
};
@Module({
  imports: [ConfigModule],
  providers: [RedisProvider],
  exports: [RedisProvider],
})
export class RedisModule {}
