import type { User, UserCredential } from '../user';
import type { ServiceReturn } from 'src/shared/types/service.type';

export abstract class UsersServicePort {
  abstract getUserByEmail(email: User['email']): ServiceReturn<User>;
  abstract createUser(
    userCredential: Pick<UserCredential, 'email' | 'password'> & Partial<UserCredential>,
  ): ServiceReturn<User['id']>;
}
