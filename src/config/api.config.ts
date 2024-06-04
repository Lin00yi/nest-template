import { registerAs } from '@nestjs/config';

export default registerAs('api-docs', () => ({
  title: process.env.API_TITLE || 'Nestjs API Documentation',
  description: process.env.API_DESCRIPTION || 'Nest api description',
  version: process.env.API_VERSION || '1.0.0',
}));
