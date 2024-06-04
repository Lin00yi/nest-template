import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { resolve } from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<'mysql' | 'postgres' | 'sqlite' | 'mssql'>(
        'database.type',
      ),
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.database'),
      entities: [resolve(__dirname, '../modules/**/entities/*.{js,ts}')],
      synchronize: true,
      autoLoadEntities: true,
      //   // 从当前目录及其子目录中的所有 .entity 文件加载实体。
      //   // __dirname: 这是当前文件的目录。
      //   // '/**/*.entity{.ts,.js}': 这是一个 glob 模式，用于匹配当前目录及其子目录中的所有 .entity 结尾的文件，
      //   // 无论它们是 .ts（TypeScript）还是 .js（JavaScript）格式。
      //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
      //   synchronize: true, // 自动同步数据库
    };
  }
}
