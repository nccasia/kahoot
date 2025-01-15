import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseType } from '@base/decorators/response-swagger.decorator';
import { ResponseLogin } from './types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponseType(ResponseLogin)
  @Post('/login')
  login() {
    return this.authService.login();
  }
}
