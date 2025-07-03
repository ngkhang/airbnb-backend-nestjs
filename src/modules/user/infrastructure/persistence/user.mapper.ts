import { binaryToUuid } from 'src/shared/utils/uuid';

import type { User, UserCredential, UserProfile } from '../../domain/user.entity';
import type { UserDto } from '../../dto/user.dto';
import type { user_credentials as UserCredentialModel, user_profiles as UserProfileModel } from '@prisma/client';

type UserModel = UserCredentialModel & { user_profiles: UserProfileModel | null };

export class UserMapper {
  static modelToDomain(userModel: UserModel): User {
    const { user_profiles: profileModel, ...credentialModel } = userModel;

    const credential = UserMapper.credentialModelToDomain(credentialModel);

    return {
      ...credential,
      profile: profileModel ? UserMapper.profileModelToDomain(profileModel) : null,
    };
  }

  static domainToDto(userDomain: User): Omit<UserDto, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...domain } = userDomain;
    return {
      ...domain,
    };
  }

  private static profileModelToDomain(profileModel: UserProfileModel): UserProfile {
    return {
      firstName: profileModel.first_name,
      lastName: profileModel.last_name,
      avatar: profileModel.avatar,
      phoneNumber: profileModel.phone_number,
      bio: profileModel.bio,
      language: profileModel.language,
      gender: profileModel.gender,
      dateOfBirth: profileModel.date_of_birth,
      createdAt: profileModel.created_at,
      updatedAt: profileModel.updated_at,
    };
  }

  private static credentialModelToDomain(credentialModel: UserCredentialModel): UserCredential {
    return {
      id: binaryToUuid(credentialModel.id),
      email: credentialModel.email,
      username: credentialModel.username,
      passwordHash: credentialModel.password_hash,
      status: credentialModel.status,
      role: credentialModel.role,
      verifiedAt: credentialModel.verified_at,
      createdAt: credentialModel.created_at,
      updatedAt: credentialModel.updated_at,
    };
  }
}
