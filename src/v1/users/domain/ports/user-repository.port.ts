import type { User, UserCredential } from '../user';

export abstract class UsersRepositoryPort {
  abstract findByEmail(email: User['email']): Promise<User | null>;
  abstract create(
    payload: Omit<UserCredential, 'id' | 'emailVerifiedAt' | 'createdAt' | 'updatedAt'>,
  ): Promise<User['id']>;
}
