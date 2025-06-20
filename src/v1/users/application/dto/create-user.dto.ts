import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

import { ValidationMessages } from 'src/shared/validation/message.validation';

@ApiSchema({
  name: 'CreateUserDto',
  description: 'DTO for create a new user.',
})
export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'user01@gmail.com',
  })
  @IsEmail({}, { message: ValidationMessages.mustBeValidType('email', 'email') })
  @IsNotEmpty({ message: ValidationMessages.notEmpty('email') })
  email: string;

  @ApiProperty({
    type: String,
    example: 'User@1234',
  })
  @Matches(/(?=.*[a-z])/, {
    message: ValidationMessages.mustContainCharacter('password', 'lowercase'),
  })
  @Matches(/(?=.*[A-Z])/, {
    message: ValidationMessages.mustContainCharacter('password', 'uppercase'),
  })
  @Matches(/(?=.*\d+)/, {
    message: ValidationMessages.mustContainCharacter('password', 'number'),
  })
  @Matches(/(?=.*\W+)/, {
    message: ValidationMessages.mustContainCharacter('password', 'special'),
  })
  @MinLength(8, { message: ValidationMessages.mustMinLength('password', 8) })
  @MaxLength(20, { message: ValidationMessages.mustMaxLength('password', 20) })
  @IsString({ message: ValidationMessages.mustString('password') })
  @IsString({ message: ValidationMessages.mustString('password') })
  @IsNotEmpty({ message: ValidationMessages.notEmpty('password') })
  password: string;
}
