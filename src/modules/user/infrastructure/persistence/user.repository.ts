import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/core/prisma/prisma.service';
import { binaryToUuid, uuidToBinary } from 'src/shared/utils/uuid';

import { Gender } from '../../constants/user.constant';
import { User, UserCredential, UserProfile } from '../../domain/user.entity';
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

  async findByPhone(phoneNumber: string): Promise<User | null> {
    const record = await this.prisma.user_profiles.findFirst({
      where: { phone_number: phoneNumber },
      // omit: { id: true, user_credentials_id: true },
      include: { user_credentials: true },
    });

    if (!record) return null;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { user_credentials: credential, ...user_profiles } = record;
    return UserMapper.modelToDomain({ ...credential, user_profiles });
  }

  async create(user: Pick<User, 'id' | 'email' | 'username' | 'passwordHash'>): Promise<string> {
    const newCredentialUser = UserMapper.domainToCreateModel(user);

    const record = await this.prisma.user_credentials.create({
      data: {
        ...newCredentialUser,
        user_profiles: {
          create: {
            gender: Gender.NOT_PROVIDED,
          },
        },
      },
    });

    return binaryToUuid(record.id);
  }

  async update(
    id: string,
    credential: Partial<Omit<UserCredential, 'id' | 'email' | 'createdAt' | 'updatedAt'>> | null,
    profile?: Partial<Omit<UserProfile, 'createdAt' | 'updatedAt'>> | null,
  ): Promise<null> {
    const credentialUpdateModel = credential ? UserMapper.credentialDomainToUpdateModel(credential) : {};
    const profileUpdateModel = profile ? UserMapper.profileDomainToUpdateModel(profile) : {};

    await this.prisma.user_credentials.update({
      where: {
        id: uuidToBinary(id),
      },
      data: {
        ...credentialUpdateModel,
        user_profiles: {
          update: profileUpdateModel,
        },
      },
    });

    return null;
  }

  async delete(id: string): Promise<null> {
    const deleteProfile = this.prisma.user_profiles.delete({
      where: {
        user_credentials_id: uuidToBinary(id),
      },
    });

    const deleteCredential = this.prisma.user_credentials.delete({
      where: {
        id: uuidToBinary(id),
      },
    });

    await this.prisma.$transaction([deleteProfile, deleteCredential]);

    return null;
  }
}
