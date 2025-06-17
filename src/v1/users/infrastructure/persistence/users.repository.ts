import { Injectable } from '@nestjs/common';

import { DatabaseService } from 'src/core/database/database.service';
import { binaryToUuid } from 'src/utils/uuid';

import { UserMapper } from '../../application/user.mapper';
import { UsersRepositoryPort } from '../../domain/ports/user-repository.port';
import { User, UserCredential } from '../../domain/user';

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

  async create(
    payload: Omit<UserCredential, 'id' | 'emailVerifiedAt' | 'createdAt' | 'updatedAt'>,
  ): Promise<User['id']> {
    const userModel = UserMapper.toUserCredentialsCreateModel(payload);

    const model = await this.database.user_credentials.create({
      data: userModel,
    });

    return binaryToUuid(model.id);
  }
}
