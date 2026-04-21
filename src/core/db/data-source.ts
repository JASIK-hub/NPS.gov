import 'dotenv/config';
import { DataSource } from 'typeorm';
import { ENV_KEYS } from '../config/env-keys';

export default new DataSource({
  type: 'postgres',
  host: process.env[ENV_KEYS.POSTGRES_HOST],
  port: Number(process.env[ENV_KEYS.POSTGRES_PORT]),
  password: process.env[ENV_KEYS.POSTGRES_PASSWORD],
  username: process.env[ENV_KEYS.POSTGRES_USERNAME],
  database: process.env[ENV_KEYS.POSTGRES_DATABASE],
  migrations: ['src/core/db/migrations/*{.ts,.js}'],
  entities: ['src/**/*.entity{.ts,.js}'],
  synchronize: false,
});
