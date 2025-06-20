import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { UserDto } from 'src/v1/users/application/dto/user.dto';

@ApiSchema({
  name: 'RegisterResponseDto',
  description: 'DTO for user register response.',
})
export class RegisterResponseDto {
  @ApiProperty({
    type: String,
    example: '91459fe3-5f98-4153-ac42-12efc62aa9d9',
  })
  userId: UserDto['id'];
}
