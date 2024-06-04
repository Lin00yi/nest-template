import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultService } from './utils/resultUtils';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WebsocketModule } from './modules/websocket/Websocket.module';
import { SseModule } from './modules/sse/sse.module';
import { ChatModule } from './modules/chat/chat.module';
import { TypeOrmConfigService } from './providers/typeorm.config.service';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import apiConfig from './config/api.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, appConfig, apiConfig],
      isGlobal: true,
    }),
    UserModule,
    ProductModule,
    WebsocketModule,
    SseModule,
    ChatModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwtSecret'),
        signOptions: { expiresIn: '1h' }, //过期时间
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ResultService],
  exports: [], // 导出以便其他模块使用
})
export class AppModule implements NestModule {
  configure() {}
}
