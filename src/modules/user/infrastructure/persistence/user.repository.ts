import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/core/prisma/prisma.service';
import { uuidToBinary } from 'src/shared/utils/uuid';

import { User } from '../../domain/user.entity';
import { UserRepositoryPort } from '../../domain/user.port';

import { UserMapper } from './user.mapper';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const records = await this.prisma.user_credentials.findMany({
      include: { user_profiles: true },
    });

    return records.length === 0 ? [] : records.map((record) => UserMapper.modelToDomain(record));
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user_credentials.findUnique({
      where: { id: uuidToBinary(id) },
      include: { user_profiles: true },
    });

    return record ? UserMapper.modelToDomain(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user_credentials.findUnique({
      where: { email },
      include: { user_profiles: true },
    });

    return record ? UserMapper.modelToDomain(record) : null;
  }
}
