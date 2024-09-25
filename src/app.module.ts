import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './lib/prisma.service';
import { env } from './lib/env';
import { JwtModule } from '@nestjs/jwt';
import { EventController } from './event/event.controller';
import { EventModule } from './event/event.module';
import { EventService } from './event/event.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: env.JWT_SECRET,
      signOptions: {
        expiresIn: env.JWT_EXPIRES_IN,
      },
    }),
    AuthModule,
    UserModule,
    EventModule,
  ],
  controllers: [AppController, EventController],
  providers: [AppService, AuthService, PrismaService, EventService],
})
export class AppModule {}
