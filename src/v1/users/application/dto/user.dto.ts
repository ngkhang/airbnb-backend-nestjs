import { ApiHideProperty, ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { ValidationMessages } from 'src/shared/validation/message.validation';

import { Gender, UserAccountStatus, UserRole } from '../../domain/user';

@ApiSchema({
  name: 'UserProfileDto',
  description: 'DTO for representation a profile of user.',
})
class UserProfileDto {
  @ApiPropertyOptional({ type: String })
  @IsString({ message: ValidationMessages.mustString('firstName') })
  @IsOptional()
  firstName: string | null;

  @ApiPropertyOptional({ type: String })
  @IsString({ message: ValidationMessages.mustString('lastName') })
  @IsOptional()
  lastName: string | null;

  @ApiPropertyOptional({ type: String })
  @IsUrl({}, { message: ValidationMessages.mustBeValidType('avatar', 'URL') })
  @IsOptional()
  avatar: string | null;

  @ApiPropertyOptional({ type: String })
  @IsPhoneNumber(undefined, { message: ValidationMessages.mustBeValidType('phoneNumber', 'phone number') })
  @IsOptional()
  phoneNumber: string | null;

  @ApiPropertyOptional({ type: String })
  @IsString({ message: ValidationMessages.mustString('bio') })
  @IsOptional()
  bio: string | null;

  @ApiPropertyOptional({ type: String })
  @IsDateString({}, { message: ValidationMessages.mustBeValidType('dateOfBirth', 'date string') })
  @IsOptional()
  dateOfBirth: string | null;

  @ApiProperty({
    enumName: 'Gender',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender, {
    message: ValidationMessages.mustBeFollowValues('gender', Object.values(Gender)),
  })
  gender: keyof typeof Gender;

  @ApiProperty({
    type: String,
    example: new Date().toISOString(),
  })
  @IsDateString({}, { message: ValidationMessages.mustBeValidType('createdAt', 'date string') })
  createdAt: string;

  @ApiProperty({
    type: String,
    example: new Date().toISOString(),
  })
  @IsDateString({}, { message: ValidationMessages.mustBeValidType('updatedAt', 'date string') })
  updatedAt: string;
}

@ApiSchema({
  name: 'UserDto',
  description: 'DTO for representation a user.',
})
export class UserDto {
  @ApiProperty({ type: String })
  @IsUUID('4', { message: ValidationMessages.mustBeValidType('id', 'UUID') })
  @IsNotEmpty({ message: ValidationMessages.notEmpty('id') })
  id: string;

  @ApiProperty({
    type: String,
    example: 'user01@gmail.com',
  })
  @IsEmail({}, { message: ValidationMessages.mustBeValidType('email', 'email') })
  @IsNotEmpty({ message: ValidationMessages.notEmpty('email') })
  email: string;

  @ApiHideProperty()
  @Exclude()
  password: string;

  @ApiProperty({
    type: String,
    example: 'user01',
  })
  @IsString({ message: ValidationMessages.mustString('username') })
  @IsNotEmpty({ message: ValidationMessages.notEmpty('username') })
  username: string;

  @ApiProperty({
    enumName: 'UserRole',
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsEnum(UserRole, {
    message: ValidationMessages.mustBeFollowValues('role', Object.values(UserRole)),
  })
  role: keyof typeof UserRole;

  @ApiProperty({
    enumName: 'UserAccountStatus',
    enum: UserAccountStatus,
    example: UserAccountStatus.ACTIVE,
  })
  @IsEnum(UserAccountStatus, {
    message: ValidationMessages.mustBeFollowValues('status', Object.values(UserAccountStatus)),
  })
  status: keyof typeof UserAccountStatus;

  @ApiPropertyOptional({
    type: String,
    example: null,
  })
  @IsDateString({}, { message: ValidationMessages.mustBeValidType('emailVerifiedAt', 'date string') })
  @IsOptional()
  emailVerifiedAt: string | null;

  @ApiProperty({
    type: String,
    example: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString(),
  })
  @IsDateString({}, { message: ValidationMessages.mustBeValidType('createdAt', 'date string') })
  createdAt: string;

  @ApiProperty({
    type: String,
    example: new Date().toISOString(),
  })
  @IsDateString({}, { message: ValidationMessages.mustBeValidType('updatedAt', 'date string') })
  updatedAt: string;

  @ApiPropertyOptional({ type: () => UserProfileDto })
  @ValidateNested()
  @Type(() => UserProfileDto)
  profile: UserProfileDto | null;
}
