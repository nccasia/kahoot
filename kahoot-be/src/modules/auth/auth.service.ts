import { SecurityOptions } from '@constants';
import { MezonHashUser } from '@modules/user/dto/socket-user.dto';
import { User } from '@modules/user/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Base64 } from 'js-base64';
import * as queryString from 'query-string';
import { Hasher } from 'src/utils';
import { Repository } from 'typeorm';
import { HashData, MezonAuthDto } from './dto/mezon-auth.dto';
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
    const { hashData } = authDto;
    const rawHashData = Base64.decode(hashData);
    const mezonEventData: any = queryString.parse(rawHashData, {
      sort: false,
    });

    const { hash, ...hashParams } = mezonEventData as HashData;
    const mezonUser = JSON.parse(hashParams?.user) as MezonHashUser;
    const hashParamsString = rawHashData?.split('&hash=')[0];

    const botToken = this.configService.getOrThrow('MEZON_APP_SECRET');
    const secretKey = Hasher.HMAC_SHA256(botToken, 'WebAppData');
    const hashedData = Hasher.HEX(
      Hasher.HMAC_SHA256(secretKey, hashParamsString),
    );
    console.log('hashedData: ', hashedData);
    console.log('hash: ', hash);
    if (hashedData !== hash) {
      throw new UnauthorizedException({
        message:
          'You are not authorized with Mezon, please login and try again',
      });
    }

    let storedUser = await this.usersRepository.findOne({
      where: {
        mezonUserId: mezonUser.id,
        userName: mezonUser.username,
      },
    });
    if (!storedUser) {
      storedUser = this.usersRepository.create({
        ...mezonUser,
      });
      await this.usersRepository.save(storedUser);
    }
    const token = await this.buildToken({
      ...storedUser,
      avatar: mezonUser?.avatar_url,
    });

    return plainToInstance(
      ResponseToken,
      {
        ...token,
        ...storedUser,
        userId: storedUser.id,
      },
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
