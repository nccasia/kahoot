import { ERROR_CODES } from '@constants';
import { AccessTokenPayload } from '@modules/auth/types';
import { UserSocket } from '@modules/room/types';
import { SocketUser } from '@modules/user/dto/socket-user.dto';
import { User } from '@modules/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { plainToInstance } from 'class-transformer';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { validate } from 'uuid';

export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;

export const WSAuthMiddleware = (
  userRepository: Repository<User>,
  JwtService: JwtService,
): SocketMiddleware => {
  return async (client: UserSocket, next) => {
    const isHandshake = client.handshake;
    if (!isHandshake) {
      next();
      return;
    }

    // ? TODO get from client
    const header = client.handshake.headers;
    const bearerToken = header.authorization;

    const token = bearerToken?.split(' ')[1];
    if (!bearerToken || !token) {
      next(
        new WsException({
          message: 'Please provide valid authorization header to connect',
          errorCode: ERROR_CODES.AUTH.UN_AUTHORIZED,
        }),
      );
      return;
    }
    await JwtService.verifyAsync(token).catch(() => {
      next(
        new WsException({
          message: 'Please provide valid token to connect',
          errorCode: ERROR_CODES.AUTH.UN_AUTHORIZED,
        }),
      );
      return;
    });
    const tokenPayload = JwtService.decode(token) as AccessTokenPayload;
    if (
      !tokenPayload ||
      !tokenPayload.userId ||
      !validate(tokenPayload.userId)
    ) {
      next(
        new WsException({
          message: 'Please provide valid user data to connect',
          errorCode: ERROR_CODES.AUTH.UN_AUTHORIZED,
        }),
      );
      return;
    }
    const user = await userRepository.findOne({
      where: { id: tokenPayload.userId },
      select: ['id'],
    });
    if (!user) {
      next(
        new WsException({
          message: 'You are authorized but you are not a valid user in system',
          errorCode: ERROR_CODES.AUTH.UN_AUTHORIZED,
        }),
      );
      return;
    }
    const socketUser = plainToInstance(
      SocketUser,
      { ...tokenPayload, userId: user.id },
      {
        excludeExtraneousValues: true,
      },
    );
    client.user = socketUser;
    next();
  };
};
