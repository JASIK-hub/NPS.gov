import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENV_KEYS } from '../config/env-keys';

@Module({
  imports:[
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(config:ConfigService) => ({
        type:'postgres',
        host:config.get<string>(ENV_KEYS.POSTGRES_HOST),
        port:Number(config.get<string>(ENV_KEYS.POSTGRES_PORT)),
        database:config.get<string>(ENV_KEYS.POSTGRES_DATABASE),
        password:config.get<string>(ENV_KEYS.POSTGRES_PASSWORD),
        username:config.get<string>(ENV_KEYS.POSTGRES_USERNAME),
        synchronize:false,
        entities: [__dirname + '/entities/*.entity.{js,ts}'],
        migrations: [__dirname + '/migrations/*.{js,ts}'],
      }),
  })]
})
export class DatabaseModule{}
