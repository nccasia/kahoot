import { MezonUserDto, SocketUser } from '@modules/user/dto/socket-user.dto';
import { plainToInstance } from 'class-transformer';
import { Socket } from 'socket.io';

export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;
export const WSAuthMiddleware = (): SocketMiddleware => {
  return async (client: Socket, next) => {
    // ? TODO get from client
    const header = client.handshake.headers;
    const requestUser = JSON.parse(header['x-mezon-user'] as string);
    const mezonUser: MezonUserDto = plainToInstance(MezonUserDto, requestUser, {
      excludeExtraneousValues: true,
    });
    if (!mezonUser) {
      return next(new Error('Unauthorized'));
    }
    const socketUser: SocketUser = {
      ...mezonUser,
      userId: null,
    };
    (client as any).user = socketUser;
    next();
  };
};
