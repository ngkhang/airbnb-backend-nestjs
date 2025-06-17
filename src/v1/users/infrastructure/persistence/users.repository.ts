import { Injectable } from '@nestjs/common';

import { DatabaseService } from 'src/core/database/database.service';

import { UserMapper } from '../../application/user.mapper';
import { UsersRepositoryPort } from '../../domain/ports/user-repository.port';
import { User } from '../../domain/user';

@Injectable()
export class UsersRepository implements UsersRepositoryPort {
  constructor(private readonly database: DatabaseService) {}

  async findByEmail(email: User['email']): Promise<User | null> {
    const model = await this.database.user_credentials.findUnique({
      where: {
        email,
      },
      include: {
        user_profiles: true,
      },
    });

    return model ? UserMapper.toDomain(model) : null;
  }
}
