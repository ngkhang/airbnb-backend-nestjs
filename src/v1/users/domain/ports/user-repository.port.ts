import type { User } from '../user';

export abstract class UsersRepositoryPort {
  abstract findByEmail(email: User['email']): Promise<User | null>;
}
