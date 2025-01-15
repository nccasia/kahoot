import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login() {
    const tokens = await this.buildToken(
      '40c06d24-d661-459c-aa4b-f983d3ba940d',
    );

    return tokens;
  }

  async buildToken(userId: string) {
    const accessToken = await this.jwtService.signAsync({
      userId,
    });
    return { accessToken };
  }
}
