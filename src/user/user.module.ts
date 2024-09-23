import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/lib/prisma.service';

@Module({
  providers: [AuthService, PrismaService],
  controllers: [UserController],
})
export class UserModule {
  constructor(private readonly prismaService: PrismaService) {}
}
