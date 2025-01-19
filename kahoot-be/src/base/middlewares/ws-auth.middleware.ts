import { Socket } from 'socket.io';

export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;
export const WSAuthMiddleware = (): SocketMiddleware => {
  return async (client: Socket, next) => {
    // ? TODO get from client
    const user = {
      userId: '40c06d24-d661-459c-aa4b-f983d3ba940d',
    };
    (client as any).user = user;
    next();
  };
};
