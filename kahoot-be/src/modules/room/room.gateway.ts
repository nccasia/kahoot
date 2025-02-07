import { UserWs } from '@base/decorators/user-ws.decorator';
import { WsJwtGuard } from '@base/guards/ws-auth.guard';
import { WSAuthMiddleware } from '@base/middlewares/ws-auth.middleware';
import { CACHES, NAME_SPACE_JOIN_GAME } from '@constants';
import { SocketUser } from '@modules/user/dto/socket-user.dto';
import { User } from '@modules/user/entities/user.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Logger, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import Redis from 'ioredis';
import { Namespace, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { JoinRoomDto } from './dto/join-room.dto';
import { RoomUser } from './entities/room-user.entity';
import { Room } from './entities/room.entity';
import {
  ClientConnectionEvent,
  RoomClientEvent,
  RoomServerEvent,
  StatusModifyCache,
  UserSocket,
} from './types/room.type';

@WebSocketGateway({
  namespace: NAME_SPACE_JOIN_GAME,
})
export class RoomGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  private logger = new Logger(RoomGateway.name);
  @WebSocketServer() server: Namespace;

  constructor(
    @InjectRedis() private redis: Redis,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(RoomUser)
    private roomUsersRepository: Repository<RoomUser>,
  ) {}

  async afterInit() {
    this.logger.debug(`[WEBSOCKET RUN] -------`);
    this.server.use(WSAuthMiddleware());
    // this.server.on('connection', (client: UserSocket) => {
    //   console.log('client ->>>>: ', client.user);
    //   client.user.userId = 'abc';
    // });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(ClientConnectionEvent.UserConnected)
  async userConnected(@ConnectedSocket() client: Socket) {
    console.log('CLIENT: ', client);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(RoomClientEvent.ClientEmitJoinRoom)
  async joinRoom(
    @MessageBody() joinRoomDto: JoinRoomDto,
    @ConnectedSocket() client: Socket,
    // ? TODO
    @UserWs() user,
  ) {
    const { roomId } = joinRoomDto;
    const { userId } = user;

    const room: Pick<Room, 'id'> & {
      roomUsers: (Pick<RoomUser, 'id'> & {
        user: User;
      })[];
    } = await this.roomsRepository
      .createQueryBuilder('r')
      .leftJoin('r.roomUsers', 'ru')
      .innerJoinAndSelect('ru.user', 'u')
      .where('r.id = :roomId', { roomId })
      .select(['r.id'])
      .getOne();

    if (!room) throw new WsException('Room not found');

    const members = room.roomUsers.map((ru) => ru.user);
    const joined = members.some((member) => member.id === userId);

    if (!joined) {
      await this.roomUsersRepository.insert({ roomId, userId });
    }

    await client.join(roomId);
    await client.to(roomId).emit(RoomServerEvent.ServerEmitUserJoinRoom, user);

    return {
      members,
    };
  }

  mapKeySocket(userId) {
    return `socket:${userId}`;
  }

  async modifyCacheSocketUser({
    socketId,
    userId,
    type = StatusModifyCache.Add,
  }: {
    socketId: string;
    userId: string;
    type?: StatusModifyCache;
  }) {
    const { key: mapKey } = CACHES.SOCKET;
    const key = mapKey(userId);

    if (type === StatusModifyCache.Add) {
      return this.redis.sadd(key, socketId);
    } else if (type === StatusModifyCache.Delete) {
      return this.redis.srem(key, socketId);
    }
  }

  async handleConnection(@ConnectedSocket() client: UserSocket) {
    // console.log('client: ', client);
    const currentUser = client?.user as SocketUser;
    let storedUser = await this.usersRepository.findOne({
      where: [
        { mezonUserId: currentUser.mezonUserId },
        { email: currentUser.email },
        { userName: currentUser.userName },
      ],
    });
    if (!storedUser) {
      storedUser = this.usersRepository.create({
        ...currentUser,
      });
      await this.usersRepository.save(storedUser);
    }

    client.user.userId = storedUser.id;
    await this.modifyCacheSocketUser({
      socketId: client.id,
      userId: storedUser.id,
    });

    client.on('disconnecting', async (reason) => {
      this.logger.log({
        name: client.user.userId,
        reason,
        socketId: client.id,
      });
      // filter room myself
      const rooms = Array.from(client.rooms).filter((el) => el !== client.id);
      if (rooms.length !== 0) {
        client.to(rooms).emit(RoomServerEvent.ServerEmitLeaveRoom, {
          userId: client.user.userId,
        });
      }
    });
  }

  async handleDisconnect(client: UserSocket, ...args) {
    this.logger.log({
      message: 'Disconnected...',
      client: client.id,
      args,
    });

    await this.modifyCacheSocketUser({
      socketId: client.id,
      userId: client.user.userId,
      type: StatusModifyCache.Delete,
    });
  }
}
