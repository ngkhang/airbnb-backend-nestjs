import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Gender, Role, UserStatus } from '../constants/user.constant';

@ApiSchema({
  name: 'UserCredentialDto',
  description: 'DTO for representation a credential of user.',
})
export class UserCredentialDto {
  @ApiProperty({ type: String })
  @IsUUID('4', { message: 'Invalid UUID format' })
  id: string;

  @ApiProperty({
    type: String,
    example: 'user01@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    example: 'user01',
  })
  username: string;

  @ApiProperty({
    type: String,
    example: 'User@1234',
  })
  @Matches(/(?=.*[a-z])/)
  @Matches(/(?=.*[A-Z])/)
  @Matches(/(?=.*\d+)/)
  @Matches(/(?=.*\W+)/)
  @MinLength(8)
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    enumName: 'UserStatus',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @IsEnum(UserStatus)
  status: UserStatus;

  @ApiPropertyOptional({
    type: String,
    example: null,
  })
  verifiedAt: Date | null;

  @ApiProperty({
    enumName: 'Role',
    enum: Role,
    example: Role.USER,
  })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    example: new Date().toISOString(),
  })
  @IsISO8601()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    example: new Date().toISOString(),
  })
  @IsISO8601()
  updatedAt: Date;
}

@ApiSchema({
  name: 'UserProfileDto',
  description: 'DTO for representation a profile of user.',
})
class UserProfileDto {
  @ApiPropertyOptional({
    type: String,
    example: 'Khang',
  })
  @IsString()
  @IsOptional()
  firstName: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'Nguyen',
  })
  @IsString()
  @IsOptional()
  lastName: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'https://randomuser.me/api/portraits/men/2.jpg',
  })
  @IsUrl()
  @IsString()
  @IsOptional()
  avatar: string | null;

  @ApiPropertyOptional({
    type: String,
    example: '+84789012345',
  })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string | null;

  @ApiPropertyOptional({
    type: String,
    example: '2000-02-26T00:00:00.000Z',
  })
  @IsString()
  @IsOptional()
  bio: string | null;

  @ApiPropertyOptional({
    type: String,
    example: 'en',
  })
  language: string | null;

  @ApiProperty({
    enumName: 'Gender',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional({
    type: Date,
    format: 'date',
    example: '2025-06-30',
    description: 'Accepts both date (YYYY-MM-DD) and datetime (ISO 8601) formats',
  })
  @IsISO8601({ strict: true })
  dateOfBirth: Date | null;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    example: new Date().toISOString(),
  })
  @IsISO8601()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    example: new Date().toISOString(),
  })
  @IsISO8601()
  updatedAt: Date;
}

@ApiSchema({
  name: 'UserDto',
  description: 'DTO for representation a user.',
})
export class UserDto extends UserCredentialDto {
  @ApiPropertyOptional({ type: () => UserProfileDto })
  @Type(() => UserProfileDto)
  profile: UserProfileDto | null;
}
