import { registerAs } from '@nestjs/config';
// import { Job } from 'src/modules/job/entities/job.entity';
export default registerAs('database', () => ({
  type: process.env.DB_TYPE as 'mysql' | 'postgres' | 'sqlite' | 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'default',
  logging: 'all',
  // entities: [Job], // 实体列表(运行之后会自动根据entity生成对应表)
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // 扫描实体文件
  synchronize: process.env.NODE_ENV === 'development' ? true : false, // 生产环境中应该关闭自动同步
}));
