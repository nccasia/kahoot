import { SecurityOptions } from '@constants';
import { User } from '@modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async buildToken(userInfo: User) {
    const accessToken = await this.jwtService.signAsync(
      {
        userId: userInfo.id,
        email: userInfo.email,
        userName: userInfo.userName,
      },
      {
        expiresIn: SecurityOptions.JWT_EXPIRATION_TIME,
      },
    );
    return { accessToken };
  }
}
