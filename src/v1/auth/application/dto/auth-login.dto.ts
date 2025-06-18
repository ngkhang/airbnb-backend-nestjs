import { ApiSchema, PickType } from '@nestjs/swagger';

import { CreateUserDto } from 'src/v1/users/application/dto/create-user.dto';

@ApiSchema({
  name: 'AuthLoginDto',
  description: 'DTO for user login containing email and password.',
})
export class AuthLoginDto extends PickType(CreateUserDto, ['email', 'password']) {}
