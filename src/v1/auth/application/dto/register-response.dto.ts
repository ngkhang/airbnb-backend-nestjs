import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { UserDto } from 'src/v1/users/application/dto/user.dto';

@ApiSchema({
  name: 'RegisterResponseDto',
  description: 'DTO for user register response.',
})
export class RegisterResponseDto {
  @ApiProperty({
    type: String,
  })
  userId: UserDto['id'];
}
