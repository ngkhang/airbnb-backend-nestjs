import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

import { ServerErrorCode, type TServerErrorCode } from '../constant/errorCode';

@ApiSchema({
  name: 'ErrorDetailDto',
  description: 'Error details',
})
export class ErrorDetailDto {
  @ApiProperty({ enum: ServerErrorCode, description: 'Error code identifier' })
  code: TServerErrorCode;

  @ApiProperty({ type: String, description: 'Error message description' })
  message: string;

  @ApiPropertyOptional({ type: String, description: 'Field that caused the error' })
  field?: string;

  @ApiPropertyOptional({ nullable: true, description: 'Value that caused the error' })
  value?: any;

  constructor(payload: ErrorDetailDto) {
    Object.assign(this, payload);
  }
}
