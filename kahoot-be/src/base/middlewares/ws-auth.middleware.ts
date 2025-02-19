import { ERROR_CODES } from '@constants';
import { UserSocket } from '@modules/room/types';
import { SocketUser } from '@modules/user/dto/socket-user.dto';
import { User } from '@modules/user/entities/user.entity';
import { WsException } from '@nestjs/websockets';
import { plainToInstance } from 'class-transformer';
import { isJSON } from 'class-validator';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { validate } from 'uuid';

export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;
export const WSAuthMiddleware = (
  userRepository: Repository<User>,
): SocketMiddleware => {
  return async (client: UserSocket, next) => {
    // ? TODO get from client
    const header = client.handshake.headers;
    if (!isJSON(header['x-kahoot-user'])) {
      next(
        new WsException({
          message: 'Please provide valid user data to connect',
          errorCode: ERROR_CODES.AUTH.UN_AUTHORIZED,
        }),
      );
      return;
    }
    const requestUser = JSON.parse(header['x-kahoot-user'] as string);
    const socketUser = plainToInstance(SocketUser, requestUser, {
      excludeExtraneousValues: true,
    });
    // console.log('socketUser', socketUser);
    if (!socketUser || !socketUser.userId || !validate(socketUser.userId)) {
      next(
        new WsException({
          message: 'Please provide valid user data to connect',
          errorCode: ERROR_CODES.AUTH.UN_AUTHORIZED,
        }),
      );
      return;
    }
    const user = await userRepository.findOne({
      where: { id: String(socketUser.userId) },
      select: ['id'],
    });
    if (!user) {
      next(
        new WsException({
          message: 'Please provide valid user data to connect',
          errorCode: ERROR_CODES.AUTH.UN_AUTHORIZED,
        }),
      );
      return;
    }
    client.user = socketUser;
    next();
  };
};
