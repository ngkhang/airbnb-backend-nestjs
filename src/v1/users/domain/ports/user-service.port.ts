import type { User } from '../user';
import type { ServiceReturn } from 'src/shared/types/service.type';

export abstract class UsersServicePort {
  abstract getUserByEmail(email: User['email']): ServiceReturn<User>;
}
