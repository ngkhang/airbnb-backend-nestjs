import type { Gender, Role, UserStatus } from '../constants/user.constant';

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
