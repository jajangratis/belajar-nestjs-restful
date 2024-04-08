import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error.filter';
import { JwtModule } from '@nestjs/jwt';
import { JWTService } from './jwt.service';
import { AuthMiddleware } from './auth.middleware';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'debug',
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    PrismaService,
    ValidationService,
    JWTService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  exports: [PrismaService, ValidationService, JWTService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/api/*');
  }
}
