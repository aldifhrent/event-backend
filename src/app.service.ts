import { Injectable } from '@nestjs/common';
import { PrismaService } from './lib/prisma.service';

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }
}
