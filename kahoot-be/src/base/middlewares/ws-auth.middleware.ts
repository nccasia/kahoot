import { ERROR_CODES } from '@constants';
import { UserSocket } from '@modules/room/types';
import { SocketUser } from '@modules/user/dto/socket-user.dto';
import { User } from '@modules/user/entities/user.entity';
import { WsException } from '@nestjs/websockets';
import { plainToInstance } from 'class-transformer';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';

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
    const requestUser = JSON.parse(header['x-kahoot-user'] as string);
    const socketUser = plainToInstance(SocketUser, requestUser, {
      excludeExtraneousValues: true,
    });
    if (!socketUser || !socketUser.userId) {
      next(
        new WsException({
          message: 'Please provide valid user data to connect',
          errorCode: ERROR_CODES.AUTH.UN_AUTHORIZED,
        }),
      );
      return;
    }
    const user = await userRepository.findOne({
      where: { id: socketUser.userId },
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
