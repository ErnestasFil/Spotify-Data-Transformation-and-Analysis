import type { Knex } from 'knex';
import path from 'path';

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const config: Knex.Config = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
  },
  migrations: {
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  },
};

export default config;
