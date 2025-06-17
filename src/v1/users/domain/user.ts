export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  HOST = 'HOST',
  HOST_USER = 'HOST_USER',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  NOT_PROVIDE = 'NOT_PROVIDE',
}

export enum UserAccountStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
}

export interface UserProfile {
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  phoneNumber: string | null;
  bio: string | null;
  dateOfBirth: Date | null;
  gender: keyof typeof Gender;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCredential {
  id: string;
  email: string;
  password: string;
  username: string;
  role: keyof typeof UserRole;
  status: keyof typeof UserAccountStatus;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends UserCredential {
  profile: UserProfile | null;
}
