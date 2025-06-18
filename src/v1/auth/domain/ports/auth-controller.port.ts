import type { AuthLoginDto } from '../../application/dto/auth-login.dto';
import type { LoginResponseDto } from '../../application/dto/login-response.dto';
import type { ControllerResponseDto } from 'src/shared/dtos/controller.dto';

export abstract class AuthControllerPort {
  abstract loginByEmail(credential: AuthLoginDto): Promise<ControllerResponseDto<LoginResponseDto>>;
}
