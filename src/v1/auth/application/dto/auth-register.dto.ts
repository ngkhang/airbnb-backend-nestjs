import { ApiSchema } from '@nestjs/swagger';

import { CreateUserDto } from 'src/v1/users/application/dto/create-user.dto';

@ApiSchema({
  name: 'AuthRegisterDto',
  description: 'DTO for user register containing email and password.',
})
export class AuthRegisterDto extends CreateUserDto {}
