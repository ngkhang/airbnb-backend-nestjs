import { ApiSchema, PickType } from '@nestjs/swagger';

import { UserDto } from './user.dto';

@ApiSchema({
  name: 'CreateUserDto',
  description: 'DTO for create a new user.',
})
export class CreateUserDto extends PickType(UserDto, ['email', 'password']) {}
