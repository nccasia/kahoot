import { User } from '@modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  //   async getProfileAsync(payload: AccessTokenPayload): Promise<BaseUserDto> {
  //     const { userId } = payload;
  //     const user = await this.usersRepository.findOne({
  //       where: { id: userId },
  //     });
  //     if (!user) {
  //       throw new UnauthorizedException({
  //         message: 'You are not authorized to access this resource',
  //         errorCode: ERROR_CODES.AUTH.UN_AUTHORIZED,
  //       });
  //     }
  //   }
}
