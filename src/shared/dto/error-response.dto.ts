import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  name: 'ErrorDetailDto',
  description: 'Error details',
})
export class ErrorDetailDto {
  @ApiProperty({ type: String, description: 'Error code identifier' })
  code: string;

  @ApiProperty({ type: String, description: 'Error message description' })
  message: string;

  @ApiPropertyOptional({ type: String, description: 'Field that caused the error' })
  field?: string;

  @ApiPropertyOptional({ nullable: true, description: 'Value that caused the error' })
  value?: unknown;

  constructor(payload: ErrorDetailDto) {
    Object.assign(this, payload);
  }
}
