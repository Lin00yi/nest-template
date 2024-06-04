import { registerAs } from '@nestjs/config';
export default registerAs('database', () => ({
  type: process.env.DB_TYPE as 'mysql' | 'postgres' | 'sqlite' | 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'default',
  logging: 'all',
}));
