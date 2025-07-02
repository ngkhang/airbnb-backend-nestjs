import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/core/prisma/prisma.service';

import { UserRepositoryPort } from '../../domain/user.port';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}
}
