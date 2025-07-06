import { ApiSchema, OmitType, PartialType } from '@nestjs/swagger';

import { UserProfileDto } from './user.dto';

@ApiSchema({
  name: 'UpdateProfileUserDto',
  description: 'DTO for update profile of user.',
})
export class UpdateProfileUserDto extends PartialType(OmitType(UserProfileDto, ['createdAt', 'updatedAt'])) {}
