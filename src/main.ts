import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
// import { WsAdapter } from '@nestjs/platform-ws';
import { SseMiddleware } from './middleware/sse.middleware';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  //openApi配置
  const { title, description, version } = configService.get<{
    title: string;
    description: string;
    version: string;
  }>('api-docs');
  const options = new DocumentBuilder()
    //接口文档标题
    .setTitle(title)
    //接口文档描述
    .setDescription(description)
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  //session中间件
  app.use(
    session({
      secret: configService.get<string>('app.jwtSecret'), // 生产环境中应该使用一个环境变量来保护这个密钥
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 }, // Cookie的过期时间(单位毫秒)
    }),
  );
  //跨域配置
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*', // 生产环境应指定具体的域名
    methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: process.env.CORS_HEADERS || 'Content-Type, Accept',
    credentials: process.env.CORS_CREDENTIALS === 'true', // 请确保实际字符串值是'true'或者'false'
  });

  //websocket配置
  app.useWebSocketAdapter(new IoAdapter(app)); //多命名空间
  // app.useWebSocketAdapter(new WsAdapter(app));

  //SSE配置
  app.use(SseMiddleware);

  const port = configService.get<number>('app.port');
  await app.listen(port);
}
bootstrap();
