export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  NOT_PROVIDED = 'not_provide',
}

export enum Role {
  USER = 'user',
  HOST = 'host',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export class UserProfile {
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  phoneNumber: string | null;
  bio: string | null;
  language: string | null;
  gender: Gender;
  dateOfBirth: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCredential {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  status: UserStatus;
  role: Role;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type User = UserCredential & { profile: UserProfile | null };
