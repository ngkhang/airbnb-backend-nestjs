import { binaryToUuid, generateBinaryId } from 'src/utils/uuid';

import type { User, UserCredential, UserProfile } from '../domain/user';
import type { user_profiles, user_credentials, Prisma } from '@prisma/client';

type UserModel = user_credentials & { profile?: user_profiles };

export class UserMapper {
  static toDomain(userModel: UserModel): User {
    const { profile: profileModel, ...credentials } = userModel;

    const profile: UserProfile | null = profileModel
      ? {
          firstName: profileModel.first_name,
          lastName: profileModel.last_name,
          avatar: profileModel.avatar,
          gender: profileModel.gender,
          bio: profileModel.bio,
          phoneNumber: profileModel.phone_number,
          dateOfBirth: profileModel.date_of_birth,
          createdAt: profileModel.created_at,
          updatedAt: profileModel.updated_at,
        }
      : null;

    return {
      id: binaryToUuid(credentials.id),
      email: credentials.email,
      password: credentials.password_hash,
      username: credentials.username,
      emailVerifiedAt: credentials.email_verified_at,
      status: credentials.account_status,
      role: credentials.role,
      createdAt: credentials.created_at,
      updatedAt: credentials.updated_at,
      profile,
    };
  }

  static toUserCredentialsCreateModel(
    domain: Omit<UserCredential, 'id' | 'emailVerifiedAt' | 'createdAt' | 'updatedAt'>,
  ): Prisma.user_credentialsCreateInput {
    return {
      id: generateBinaryId(),
      email: domain.email,
      password_hash: domain.password,
      username: domain.username,
      role: domain.role,
      account_status: domain.status,
    };
  }
}
