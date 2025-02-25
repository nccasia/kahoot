import { SecurityOptions } from '@constants';
import { MezonUserDto } from '@modules/user/dto/socket-user.dto';
import { User } from '@modules/user/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { sha256 } from 'js-sha256';
import { Repository } from 'typeorm';
import { HashDto, MezonAuthDto } from './dto/mezon-auth.dto';
import { ResponseToken } from './types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}
  async getAccessTokenAsync(authDto: MezonAuthDto) {
    const mezonUser = plainToInstance(MezonUserDto, authDto, {
      excludeExtraneousValues: true,
    });

    const preHashData = plainToInstance(
      HashDto,
      { ...mezonUser, userId: mezonUser.mezonUserId },
      {
        excludeExtraneousValues: true,
      },
    );

    const dataKeys = Object.keys(preHashData);
    const hashParams = dataKeys
      .map((key) => `${key}=${preHashData[key]}`)
      .join('\n');

    const appName = this.configService.getOrThrow<string>('APP_NAME');
    const botToken = this.configService.getOrThrow<string>('AUTH_BOT_TOKEN');

    const secretKey = sha256.hmac(botToken, appName);
    const hashedData = sha256.hmac(secretKey, hashParams);

    if (hashedData !== authDto.hashKey) {
      throw new UnauthorizedException({
        message:
          'You are not authorized with Mezon, please login and try again',
      });
    }

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
    const token = await this.buildToken({
      ...storedUser,
      avatar: mezonUser?.avatar,
    });
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
        mezonUserId: userInfo.mezonUserId,
        email: userInfo.email,
        userName: userInfo.userName,
        avatar: userInfo?.avatar,
      },
      {
        expiresIn: SecurityOptions.JWT_EXPIRATION_TIME,
      },
    );
    return { accessToken };
  }
}
