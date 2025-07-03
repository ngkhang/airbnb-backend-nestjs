import type { User } from './user.entity';
import type { UserResponseDto } from '../dto/user.dto';
import type { ControllerReturnDto } from 'src/shared/dto/controller-response.dto';
import type { ServiceReturn } from 'src/shared/types/service-return.type';

export abstract class UserControllerPort {
  abstract findAll(): Promise<ControllerReturnDto<UserResponseDto[]>>;
  abstract findOne(id: string): Promise<ControllerReturnDto<UserResponseDto>>;
  abstract findByEmail(email: string): Promise<ControllerReturnDto<UserResponseDto>>;
}

export abstract class UserServicePort {
  abstract getAllUsers(): ServiceReturn<User[]>;
  abstract getUserById(id: string): ServiceReturn<User>;
  abstract getUserByEmail(email: string): ServiceReturn<User>;
}

export abstract class UserRepositoryPort {
  abstract findAll(): Promise<User[]>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
}
