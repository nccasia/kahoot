import { SecurityOptions } from '@constants';
import { MezonUserDto } from '@modules/user/dto/socket-user.dto';
import { User } from '@modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { ResponseToken } from './types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async getAccessTokenAsync(mezonUser: MezonUserDto) {
    let storedUser = await this.usersRepository.findOne({
      where: [
        { mezonUserId: mezonUser.mezonUserId },
        { email: mezonUser.email },
        { userName: mezonUser.userName },
      ],
    });
    if (!storedUser) {
      storedUser = this.usersRepository.create({
        ...mezonUser,
      });
      await this.usersRepository.save(storedUser);
    }
    const token = await this.buildToken(storedUser);
    return plainToInstance(
      ResponseToken,
      { ...token, ...storedUser, userId: storedUser.id },
      {
        excludeExtraneousValues: true,
      },
    );
  }
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
