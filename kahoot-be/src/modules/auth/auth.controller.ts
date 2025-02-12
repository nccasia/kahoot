import { ApiResponseType } from '@base/decorators/response-swagger.decorator';
import { MezonUserDto } from '@modules/user/dto/socket-user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ResponseToken } from './types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiResponseType(ResponseToken)
  @Post('get-token')
  async getAccessToken(@Body() mezonUser: MezonUserDto) {
    return await this.authService.getAccessTokenAsync(mezonUser);
  }
}
