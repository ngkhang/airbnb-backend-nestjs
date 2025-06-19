import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

@ApiSchema({
  name: 'CreateUserDto',
  description: 'DTO for create a new user.',
})
export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'user01@gmail.com',
  })
  @IsEmail({}, { message: 'The email is not correct format' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    example: 'User@1234',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain a lowercase character',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain a uppercase character',
  })
  @Matches(/(?=.*\d+)/, {
    message: 'Password must contain a numerous',
  })
  @Matches(/(?=.*\W+)/, {
    message: 'Password must contain a specify character',
  })
  password: string;
}
