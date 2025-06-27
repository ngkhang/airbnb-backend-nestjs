import { ApiProperty, ApiSchema } from '@nestjs/swagger';

/**
 * The Controller response DTO (simplified for HTTP responses)
 */
@ApiSchema({
  name: 'ControllerResponseDto',
  description: 'Controller response DTO',
})
export class ControllerReturnDto<TDataDto = any> {
  @ApiProperty({
    type: Object,
    description: 'The response data payload',
  })
  data?: TDataDto;

  @ApiProperty({
    type: String,
    description: 'Response message',
    example: 'Successful',
  })
  message: string;

  constructor(payload: ControllerReturnDto<TDataDto>) {
    Object.assign(this, payload);
  }
}
