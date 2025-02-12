import { UserWs } from '@base/decorators/user-ws.decorator';
import { WsJwtGuard } from '@base/guards/ws-auth.guard';
import { WSAuthMiddleware } from '@base/middlewares/ws-auth.middleware';
import {
  CACHES,
  NAME_SPACE_JOIN_GAME,
  WAIT_TIME_PER_QUESTION,
} from '@constants';
import { Game } from '@modules/game/entities/game.entity';
import { GameQuestionDto } from '@modules/question/dto/game-question.dto';
import { RawGameQuestionDto } from '@modules/question/dto/raw-game-question.dto';
import { Question } from '@modules/question/entities/question.entity';
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
import { plainToInstance } from 'class-transformer';
import Redis from 'ioredis';
import { Namespace, Socket } from 'socket.io';
import { In, Not, Repository } from 'typeorm';
import { ClientSubmitDto } from './dto/client-submit.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { QuestionRoomUser } from './entities/question-room-user.entity';
import { RoomQuestion } from './entities/room-question.entity';
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
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    @InjectRepository(RoomUser)
    private roomUsersRepository: Repository<RoomUser>,
    @InjectRepository(QuestionRoomUser)
    private questionRoomUsersRepository: Repository<QuestionRoomUser>,
    @InjectRepository(RoomQuestion)
    private roomQuestionsRepository: Repository<RoomQuestion>,
  ) {}

  async afterInit() {
    this.logger.debug(`[WEBSOCKET RUN] -------`);
    this.server.use(WSAuthMiddleware(this.usersRepository));
  }
  // Owner events listeners
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
    const firstQuestion = await this.pickQuestionForRoom(roomId);
    const totalQuestions = await this.questionsRepository.count({
      where: { gameId: room.gameId },
    });

    this.server.to(roomId).emit(RoomServerEvent.ServerEmitGameStarted, {
      totalQuestions,
    });

    setTimeout(async () => {
      await this.emitQuestionToRoom(roomId, firstQuestion);
    }, WAIT_TIME_PER_QUESTION * 1000);
  }

  // Client or users events listeners
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

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(RoomClientEvent.ClientEmitSubmitQuestion)
  async onUserSubmitQuestion(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() submitDto: ClientSubmitDto,
  ) {
    const jsonQuestion = await this.redis.get(
      CACHES.CURRENT_QUESTION.getKey(submitDto.roomId),
    );
    if (!jsonQuestion) {
      client.emit(ClientConnectionEvent.ClientError, {
        message: 'No question to submit',
      });
      return;
    }
    const currentGameQuestion = plainToInstance(
      RawGameQuestionDto,
      JSON.parse(jsonQuestion),
    );

    if (new Date(currentGameQuestion.endTime) < new Date()) {
      client.emit(ClientConnectionEvent.ClientError, {
        message: 'Question time is over',
      });
      return;
    }

    const isCorrect =
      currentGameQuestion.correctIndex === submitDto.answerIndex;

    const lastSubmitResult = await this.questionRoomUsersRepository.findOne({
      where: {
        roomId: submitDto.roomId,
        userId: client.user.userId,
        questionId: currentGameQuestion.id,
      },
    });
    if (lastSubmitResult) {
      await this.questionRoomUsersRepository.update(
        { id: lastSubmitResult.id },
        {
          isCorrect,
          answerIndex: submitDto.answerIndex,
          submittedAt: new Date().toISOString(),
        },
      );
      return;
    }
    await this.questionRoomUsersRepository.insert({
      roomId: submitDto.roomId,
      userId: client.user.userId,
      questionId: currentGameQuestion.id,
      isCorrect,
      answerIndex: submitDto.answerIndex,
      submittedAt: new Date().toISOString(),
    });
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

  // Game handlers
  async emitQuestionToRoom(roomId: string, question: Question) {
    const roomQuestion = this.roomQuestionsRepository.create({
      roomId,
      questionId: question.id,
      endTime: new Date(
        new Date().getTime() + question.time * 1000,
      ).toISOString(),
    });
    await this.roomQuestionsRepository.save(roomQuestion);
    const rawGameQuestion = plainToInstance(RawGameQuestionDto, {
      ...question,
      correctIndex: question.answerOptions.correctIndex,
      startTime: roomQuestion.startTime,
      endTime: roomQuestion.endTime,
    });
    const gameQuestion = plainToInstance(GameQuestionDto, rawGameQuestion, {
      excludeExtraneousValues: true,
    });
    // Save question to cache
    const { getKey, exprieTime } = CACHES.CURRENT_QUESTION;
    const questionKey = getKey(roomId);
    await this.redis.set(
      questionKey,
      JSON.stringify(rawGameQuestion),
      'EX',
      exprieTime(question.time),
    );
    /**
     * Emit question withthout correct answer to room
     */
    this.server.to(roomId).emit(RoomServerEvent.ServerEmitQuestion, {
      question: gameQuestion,
    });

    setTimeout(async () => {
      // TODO: handle users submit correct answer and emit correct answer
      // TODO: handle calculate score and rank
    }, question.time * 1000);
  }

  async pickQuestionForRoom(roomId: string) {
    // Select random question from game except question that already picked
    const room = await this.roomsRepository.findOne({
      where: { id: roomId },
      select: ['gameId'],
    });
    const pickedQuestionIds = await this.roomQuestionsRepository.find({
      where: { roomId },
      select: ['questionId'],
    });
    const remianingQuestions = await this.questionsRepository.find({
      where: {
        gameId: room.gameId,
        id: Not(In(pickedQuestionIds?.map((q) => q.questionId))),
      },
    });

    if (!remianingQuestions || remianingQuestions?.length === 0) {
      return null;
    }
    return remianingQuestions[
      Math.floor(Math.random() * remianingQuestions.length)
    ];
  }
}
