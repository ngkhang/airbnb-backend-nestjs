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
  @Matches(/(?=.*[a-z])/g, {
    message: 'Password must container a lowercase character',
  })
  @Matches(/(?=.*[A-Z])/g, {
    message: 'Password must container a uppercase character',
  })
  @Matches(/(?=.*\d+)/g, {
    message: 'Password must container a numerous',
  })
  @Matches(/(?=.*\W+)/g, {
    message: 'Password must container a specify character',
  })
  password: string;
}
