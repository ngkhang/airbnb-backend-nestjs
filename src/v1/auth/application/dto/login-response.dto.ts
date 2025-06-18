import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { UserDto } from 'src/v1/users/application/dto/user.dto';

export class LoginResponseDto {
  @ApiProperty({
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @ApiProperty({
    type: String,
    description: '',
    example: 'eyJhbGciOiJIUzI1NiIsI...',
  })
  accessToken: string;
}
