import { binaryToUuid, uuidToBinary } from 'src/shared/utils/uuid';

import type { User, UserCredential, UserProfile } from '../../domain/user.entity';
import type { UserDto } from '../../dto/user.dto';
import type {
  Prisma,
  user_credentials as UserCredentialModel,
  user_profiles as UserProfileModel,
} from '@prisma/client';

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

  static domainToCreateModel(
    userDomainCreate: Pick<UserCredential, 'id' | 'email' | 'passwordHash' | 'username'>,
  ): Prisma.user_credentialsCreateInput {
    return {
      id: uuidToBinary(userDomainCreate.id),
      email: userDomainCreate.email,
      password_hash: userDomainCreate.passwordHash,
      username: userDomainCreate.username,
    };
  }

  static credentialDomainToUpdateModel(
    credentialDomain: Partial<Omit<UserCredential, 'id' | 'email' | 'createdAt' | 'updatedAt'>>,
  ): Prisma.user_credentialsUpdateInput {
    return {
      password_hash: credentialDomain.passwordHash,
      username: credentialDomain.username,
      status: credentialDomain.status,
      role: credentialDomain.role,
      verified_at: credentialDomain.verifiedAt,
    };
  }

  static profileDomainToUpdateModel(
    profileDomain: Partial<Omit<UserProfile, 'createdAt' | 'updatedAt'>>,
  ): Prisma.user_profilesUpdateInput {
    return {
      first_name: profileDomain.firstName,
      last_name: profileDomain.lastName,
      avatar: profileDomain.avatar,
      phone_number: profileDomain.phoneNumber,
      bio: profileDomain.bio,
      language: profileDomain.language,
      gender: profileDomain.gender,
      date_of_birth: profileDomain.dateOfBirth && new Date(profileDomain.dateOfBirth),
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
