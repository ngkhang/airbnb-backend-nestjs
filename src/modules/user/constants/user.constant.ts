export const Gender = <const>{
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
  NOT_PROVIDED: 'not_provide',
};
export type Gender = (typeof Gender)[keyof typeof Gender];

export const Role = <const>{
  USER: 'user',
  HOST: 'host',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
};
export type Role = (typeof Role)[keyof typeof Role];

export const UserStatus = <const>{
  PENDING: 'pending',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
