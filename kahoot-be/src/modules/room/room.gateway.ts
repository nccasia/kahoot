import { WSAuthMiddleware } from '@base/middlewares/ws-auth.middleware';
import { CACHES, NAME_SPACE_JOIN_GAME } from '@constants';
import { Logger, UseGuards } from '@nestjs/common';
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
import { Namespace, Socket } from 'socket.io';
import {
  RoomClientEvent,
  RoomServerEvent,
  StatusModifyCache,
  UserSocket,
} from './types/room.type';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { WsJwtGuard } from '@base/guards/ws-auth.guard';
import { JoinRoomDto } from './dto/join-room.dto';
import { UserWs } from '@base/decorators/user-ws.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { RoomUser } from './entities/room-user.entity';
import { User } from '@modules/user/entities/user.entity';

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
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(RoomUser)
    private roomUsersRepository: Repository<RoomUser>,
  ) {}

  async afterInit() {
    this.logger.debug(`[WEBSOCKET RUN] -------`);
    this.server.use(WSAuthMiddleware());
    // await this.cacheManager.reset();
    this.redis.set('test', 'hello 123');
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('hello 123');
    return 'Hello world!';
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

    if (!room) throw new WsException('room not found');

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

  async handleConnection(@ConnectedSocket() client: UserSocket, ...args) {
    // client.on('disconnecting', async (reason) => {
    //   this.logger.log({
    //     name: client.user.userId,
    //     reason,
    //     socketId: client.id,
    //   });
    //   const rooms = Array.from(client.rooms).filter((el) => el !== client.id);
    //   if (rooms.length !== 0) {
    //     client.to(rooms).emit(SERVER_EVENT.SERVER_EMIT_LEAVE_ROOM, {
    //       userId: client.user.userId,
    //     });
    //   }
    // });
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
