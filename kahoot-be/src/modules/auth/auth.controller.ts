import { ApiResponseType } from '@base/decorators/response-swagger.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { MezonAuthDto } from './dto/mezon-auth.dto';
import { ResponseToken } from './types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiResponseType(ResponseToken)
  @Post('get-token')
  async getAccessToken(@Body() authDto: MezonAuthDto) {
    return await this.authService.getAccessTokenAsync(authDto);
  }
}
