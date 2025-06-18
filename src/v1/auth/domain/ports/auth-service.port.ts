import type { ServiceReturn } from 'src/shared/types/service.type';
import type { User } from 'src/v1/users/domain/user';

export abstract class AuthServicePort {
  abstract loginByEmail(
    credential: Pick<User, 'email' | 'password'>,
  ): ServiceReturn<{ user: User; accessToken: string }>;
}
