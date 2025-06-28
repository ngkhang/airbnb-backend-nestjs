import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      errorFormat: 'pretty',
    });
  }

  async onModuleInit(): Promise<void> {
    const logger = new Logger();

    try {
      await this.$connect();
      logger.log('Prisma connected');
    } catch (error) {
      logger.error('Prisma connection error');
      throw error;
    }
  }
}
