import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENV_KEYS } from '../config/env-keys';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get(ENV_KEYS.POSTGRES_URL),
        synchronize: false,
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [__dirname + '/entities/*.entity.{js,ts}'],
        migrations: [__dirname + '/migrations/*.{js,ts}'],
      }),
    }),
  ],
})
export class DatabaseModule {}
