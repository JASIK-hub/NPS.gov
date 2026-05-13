import 'dotenv/config';
import { DataSource } from 'typeorm';
import { ENV_KEYS } from '../config/env-keys';

export default new DataSource({
  type: 'postgres',
  url: process.env[ENV_KEYS.POSTGRES_URL],
  migrations: ['src/core/db/migrations/*{.ts,.js}'],
  entities: ['src/**/*.entity{.ts,.js}'],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
});
