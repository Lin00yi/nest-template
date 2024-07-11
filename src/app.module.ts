import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { JobModule } from './modules/job/job.module';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import apiConfig from './config/api.config';
import { SseMiddleware } from './middleware/sseCommon.middleware';
import { ssePath } from './constants';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './common/customException.filter';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, appConfig, apiConfig],
      isGlobal: true,
    }),
    UserModule,
    SseModule,
    JobModule, //爬取招聘信息
    ProductModule,
    WebsocketModule,
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
  providers: [
    AppService,
    ResultService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
  exports: [], // 导出以便其他模块使用
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SseMiddleware)
      .forRoutes(ssePath.sse, ssePath.jobSpiderStart); // 只在特定路由上应用中间件
  }
}
