/**
 * The Controller response DTO (simplified for HTTP responses)
 */
export class ControllerResponseDto<TDataDto> {
  data: TDataDto;
  message: string;
}
