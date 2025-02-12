import { UserWs } from '@base/decorators/user-ws.decorator';
import { WsJwtGuard } from '@base/guards/ws-auth.guard';
import { WSAuthMiddleware } from '@base/middlewares/ws-auth.middleware';
import { CACHES, NAME_SPACE_JOIN_GAME } from '@constants';
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
  RoomStatus,
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
    this.server.use(WSAuthMiddleware(this.usersRepository));
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(RoomClientEvent.OwnerStartGame)
  async onOnwerStartGame(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() roomId: string,
  ) {
    const room = await this.roomsRepository.findOne({
      where: { id: roomId },
    });
    if (!room || room.ownerId !== client.user.userId) {
      client.emit(ClientConnectionEvent.ClientError, {
        message: `Room with id ${roomId} not found or you are not the owner to start the game`,
      });
      return;
    }
    if (room.status !== RoomStatus.Waiting) {
      client.emit(ClientConnectionEvent.ClientError, {
        message: `Room with id ${roomId} cannot be start because it in progess or finished`,
      });
      return;
    }
    await this.roomsRepository.update(
      { id: roomId },
      { status: RoomStatus.InProgress },
    );
    // TODO: handle get question to start game
    this.server.to(roomId).emit(RoomServerEvent.ServerEmitGameStarted, {
      message: 'Game started',
    });
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

    const room: Pick<Room, 'id' | 'status' | 'ownerId'> & {
      roomUsers: (Pick<RoomUser, 'id'> & {
        user: User;
      })[];
    } = await this.roomsRepository
      .createQueryBuilder('r')
      .leftJoin('r.roomUsers', 'ru')
      .innerJoinAndSelect('ru.user', 'u')
      .where('r.id = :roomId', { roomId })
      .select(['r.id', 'r.status', 'r.ownerId'])
      .getOne();

    if (!room) {
      throw new WsException({
        message: `Room with id ${roomId} not found`,
      });
    }

    if (room?.status !== RoomStatus.Waiting) {
      throw new WsException({
        message: `Room with id ${roomId} cannot be join because it in progess or finished`,
      });
    }

    const members = room.roomUsers.map((ru) => ru.user);
    const joined = members.some((member) => member.id === userId);

    if (!joined) {
      await this.roomUsersRepository.insert({ roomId, userId });
    }

    await client.join(roomId);
    client.emit(RoomServerEvent.UserJoinedRoom, {
      roomId,
      isOwner: room.ownerId === userId,
      members,
    });

    this.server.to(roomId).emit(RoomServerEvent.ServerEmitUserJoinRoom, user);
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
    if (!client.user) {
      throw new WsException({
        message: 'Please provide valid user data to connect',
      });
    }
    await this.modifyCacheSocketUser({
      socketId: client.id,
      userId: client.user.userId,
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
        this.server.to(rooms).emit(RoomServerEvent.ServerEmitLeaveRoom, {
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
