import { ApiResponseType } from '@base/decorators/response-swagger.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResponseLogin, ResponseRegister } from './types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponseType(ResponseRegister)
  @Post('/register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.registerAsync(registerDto);
  }

  @ApiResponseType(ResponseLogin)
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
