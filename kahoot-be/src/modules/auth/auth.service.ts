import { ERROR_CODES, SecurityOptions } from '@constants';
import { User } from '@modules/user/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResponseLogin, ResponseRegister } from './types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async registerAsync(registerDto: RegisterDto): Promise<ResponseRegister> {
    const existingUser = await this.usersRepository.findOne({
      where: [{ email: registerDto.email }, { userName: registerDto.userName }],
    });
    if (existingUser) {
      throw new BadRequestException({
        message: 'The user_name or email already used',
        errorCode: ERROR_CODES.AUTH.USER_ALREADY_EXISTS,
      });
    }

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      SecurityOptions.PASSWORD_SALT_ROUNDS,
    );
    const user = this.usersRepository.create({
      ...registerDto,
      hashedPassword,
    });
    await this.usersRepository.save(user);
    return plainToInstance(ResponseRegister, user, {
      excludeExtraneousValues: true,
    });
  }

  async login(loginDto: LoginDto): Promise<ResponseLogin> {
    const loginUser = await this.usersRepository.findOne({
      where: [{ email: loginDto.userName }, { userName: loginDto.userName }],
    });
    if (!loginUser) {
      throw new BadRequestException({
        message: 'Invalid user_name or password',
        errorCode: ERROR_CODES.AUTH.INVALID_PASSWORD,
      });
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      loginUser.hashedPassword,
    );
    if (!isPasswordValid) {
      throw new BadRequestException({
        message: 'Invalid user_name or password',
        errorCode: ERROR_CODES.AUTH.INVALID_PASSWORD,
      });
    }

    const accessToken = await this.buildToken(loginUser);
    return accessToken;
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
