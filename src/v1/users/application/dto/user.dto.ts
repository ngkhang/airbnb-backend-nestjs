import { ApiHideProperty, ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Gender, UserAccountStatus, UserRole } from '../../domain/user';

@ApiSchema({
  name: 'UserProfileDto',
  description: 'DTO for representation a profile of user.',
})
class UserProfileDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  firstName: string | null;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  lastName: string | null;

  @ApiPropertyOptional({ type: String })
  avatar: string | null;

  @ApiPropertyOptional({ type: String })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string | null;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  bio: string | null;

  @ApiPropertyOptional({ type: String })
  @IsDate()
  @IsOptional()
  dateOfBirth: Date | null;

  @ApiProperty({
    enumName: 'Gender',
    enum: Object.keys(Gender).filter((key) => isNaN(Number(key))),
    example: Gender.MALE,
  })
  @IsString()
  @IsEnum(Gender, {
    message: `Gender must be one of the following values: ${Object.keys(Gender)
      .filter((key) => isNaN(Number(key)))
      .join(', ')}`,
  })
  gender: keyof typeof Gender;

  @ApiProperty({
    type: String,
    example: new Date().toISOString(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    type: String,
    example: new Date().toISOString(),
  })
  @IsDate()
  updatedAt: Date;
}

@ApiSchema({
  name: 'UserDto',
  description: 'DTO for representation a user.',
})
export class UserDto {
  @ApiProperty({ type: String })
  @IsString()
  id: string;

  @ApiProperty({
    type: String,
    example: 'user1@gmail.com',
  })
  @IsEmail({}, { message: 'The email is not correct format' })
  @IsNotEmpty({})
  email: string;

  @ApiHideProperty()
  @Exclude()
  password: string;

  @ApiProperty({
    type: String,
    example: 'user01',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    enumName: 'UserRole',
    enum: Object.keys(UserRole).filter((key) => isNaN(Number(key))),
    example: UserRole.USER,
  })
  @IsString()
  @IsEnum(UserRole, {
    message: `Role must be one of the following values: ${Object.keys(UserRole)
      .filter((key) => isNaN(Number(key)))
      .join(', ')}`,
  })
  role: keyof typeof UserRole;

  @ApiProperty({
    enumName: 'UserAccountStatus',
    enum: UserAccountStatus,
    example: UserAccountStatus.ACTIVE,
  })
  @IsString()
  @IsEnum(UserAccountStatus, {
    message: `Status must be one of the following values: ${Object.keys(UserAccountStatus)
      .filter((key) => isNaN(Number(key)))
      .join(', ')}`,
  })
  status: keyof typeof UserAccountStatus;

  @ApiPropertyOptional({
    type: String,
    example: null,
  })
  emailVerifiedAt: Date | null;

  @ApiProperty({
    type: String,
    example: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    type: String,
    example: new Date().toISOString(),
  })
  @IsDate()
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => UserProfileDto })
  @ValidateNested()
  @Type(() => UserProfileDto)
  profile: UserProfileDto | null;
}
