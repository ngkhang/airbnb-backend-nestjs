import type { User, UserCredential, UserProfile } from './user.entity';
import type { CreateUserDto } from '../dto/create-user.dto';
import type { UpdateProfileUserDto } from '../dto/update-user.dto';
import type { UserResponseDto } from '../dto/user.dto';
import type { ControllerReturnDto } from 'src/shared/dto/controller-response.dto';
import type { ServiceReturn } from 'src/shared/types/service-return.type';

export abstract class UserControllerPort {
  abstract findAll(): Promise<ControllerReturnDto<UserResponseDto[]>>;
  abstract findOne(id: string): Promise<ControllerReturnDto<UserResponseDto>>;
  abstract findByEmail(email: string): Promise<ControllerReturnDto<UserResponseDto>>;
  abstract create(createUserDto: CreateUserDto): Promise<ControllerReturnDto<{ userId: string }>>;
  abstract updateProfile(id: string, updateProfileUserDto: UpdateProfileUserDto): Promise<ControllerReturnDto<null>>;
  abstract delete(id: string): Promise<ControllerReturnDto<null>>;
}

export abstract class UserServicePort {
  abstract getAllUsers(): ServiceReturn<User[]>;
  abstract getUserById(id: string): ServiceReturn<User>;
  abstract getUserByEmail(email: string): ServiceReturn<User>;
  abstract createUserByEmail(
    newUser: Pick<User, 'email' | 'password'> & { role?: User['role'] },
  ): ServiceReturn<{ userId: string }>;
  abstract updateProfileUser(
    userId: string,
    profile: Partial<Omit<UserProfile, 'createdAt' | 'updatedAt'>>,
  ): ServiceReturn<null>;
  abstract deleteUser(id: string): ServiceReturn<null>;
}

export abstract class UserRepositoryPort {
  abstract findAll(): Promise<User[]>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByPhone(phoneNumber: string): Promise<User | null>;
  abstract create(user: Pick<User, 'id' | 'email' | 'username' | 'password' | 'role'>): Promise<string>;
  abstract update(
    id: string,
    credential: Partial<Omit<UserCredential, 'id' | 'email' | 'createdAt' | 'updatedAt'>> | null,
    profile: Partial<Omit<UserProfile, 'createdAt' | 'updatedAt'>> | null,
  ): Promise<null>;
  abstract delete(id: string): Promise<null>;
}
