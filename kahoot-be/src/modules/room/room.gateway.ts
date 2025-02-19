import { UserWs } from '@base/decorators/user-ws.decorator';
import { WsJwtGuard } from '@base/guards/ws-auth.guard';
import { WSAuthMiddleware } from '@base/middlewares/ws-auth.middleware';
import {
  corsConfig,
  NAME_SPACE_JOIN_GAME,
  WAIT_TIME_PER_QUESTION,
} from '@constants';
import { Game } from '@modules/game/entities/game.entity';
import { GameQuestionDto } from '@modules/question/dto/game-question.dto';
import { RawGameQuestionDto } from '@modules/question/dto/raw-game-question.dto';
import { Question } from '@modules/question/entities/question.entity';
import { User } from '@modules/user/entities/user.entity';
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
import { Namespace, Socket } from 'socket.io';
import { In, Not, Repository } from 'typeorm';
import { ClientSubmitDto } from './dto/client-submit.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { QuestionRoomUser } from './entities/question-room-user.entity';
import { RoomQuestion } from './entities/room-question.entity';
import { RoomUser } from './entities/room-user.entity';
import { Room } from './entities/room.entity';
import { RoomCacheService } from './room-cache.service';
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
  cors: corsConfig,
})
export class RoomGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  private logger = new Logger(RoomGateway.name);
  @WebSocketServer() server: Namespace;

  constructor(
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
    private roomCacheService: RoomCacheService,
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

    this.roomCacheService.setTotalRoomQuestion(roomId, totalQuestions);

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
    const { roomCode } = joinRoomDto;
    const { userId } = user;

    const room: Pick<Room, 'id' | 'status' | 'ownerId'> & {
      roomUsers: (Pick<RoomUser, 'id'> & {
        user: User;
      })[];
    } = await this.roomsRepository.findOne({
      where: { code: String(roomCode) },
      relations: ['roomUsers', 'roomUsers.user'],
      select: ['id', 'status', 'ownerId'],
    });
    if (!room) {
      client.emit(ClientConnectionEvent.ClientError, {
        message: `Room with code ${roomCode} not found`,
      });
      return;
    }

    const members = room.roomUsers.map((ru) => ru.user);
    const joined = members.some((member) => member.id === userId);
    const isOwner = room.ownerId === userId;

    if (!joined) {
      if (room?.status !== RoomStatus.Waiting) {
        client.emit(ClientConnectionEvent.ClientError, {
          message: `Room with code ${roomCode} cannot be join because it in progess or finished`,
        });

        return;
      }
      await this.roomUsersRepository.insert({
        roomId: room.id,
        userId,
        isOwner: isOwner,
      });
    }

    await client.join(room.id);
    client.emit(RoomServerEvent.UserJoinedRoom, {
      roomId: room.id,
      isOwner: isOwner,
      members,
    });

    this.server.to(room.id).emit(RoomServerEvent.ServerEmitUserJoinRoom, user);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(RoomClientEvent.ClientEmitGetCurrentQuestion)
  async onGetCurrentQuestion(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() roomId: string,
  ) {
    const currentGameQuestion =
      await this.roomCacheService.getCurrentQuestion(roomId);
    if (!currentGameQuestion) {
      client.emit(ClientConnectionEvent.ClientError, {
        message: 'No question, please wait for next question',
      });
      return;
    }
    const gameQuestion = plainToInstance(GameQuestionDto, currentGameQuestion, {
      excludeExtraneousValues: true,
    });
    client.emit(RoomServerEvent.ServerEmitQuestion, {
      currentQuestion: gameQuestion,
    });
  }
  @UseGuards(WsJwtGuard)
  @SubscribeMessage(RoomClientEvent.ClientEmitSubmitQuestion)
  async onUserSubmitQuestion(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() submitDto: ClientSubmitDto,
  ) {
    const currentGameQuestion = await this.roomCacheService.getCurrentQuestion(
      submitDto.roomId,
    );
    if (!currentGameQuestion) {
      client.emit(ClientConnectionEvent.ClientError, {
        message: 'No question to submit',
      });
      return;
    }

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
      client.emit(ClientConnectionEvent.ClientError, {
        message: 'You already submitted this question',
      });
    }
    const newSubmitResult = this.questionRoomUsersRepository.create({
      roomId: submitDto.roomId,
      userId: client.user.userId,
      questionId: currentGameQuestion.id,
      isCorrect,
      answerIndex: submitDto.answerIndex,
      submittedAt: new Date().toISOString(),
    });
    await this.roomCacheService.setUserAnswer(submitDto.roomId, {
      ...newSubmitResult,
      userName: client.user.userName,
    });
    this.questionRoomUsersRepository.save(newSubmitResult);

    // TODO: If all users submitted answer, emit correct answer
    const countRoomUsers = await this.roomUsersRepository.count({
      where: { roomId: submitDto.roomId, isOwner: false },
    });
    const countSubmitedUser = await this.roomCacheService.countSubmitedUser(
      submitDto.roomId,
      currentGameQuestion.id,
    );
    if (countRoomUsers === countSubmitedUser) {
      await this.handleQuestionFinish(submitDto.roomId, currentGameQuestion);
    }
  }

  async handleConnection(@ConnectedSocket() client: UserSocket) {
    if (!client.user) {
      throw new WsException({
        message: 'Please provide valid user data to connect',
      });
    }
    await this.roomCacheService.modifyCacheSocketUser({
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

    await this.roomCacheService.modifyCacheSocketUser({
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
    await this.roomCacheService.setCurrentQuestion(
      roomId,
      rawGameQuestion,
      question.time,
    );
    /**
     * Emit question withthout correct answer to room
     */
    this.server.to(roomId).emit(RoomServerEvent.ServerEmitQuestion, {
      question: gameQuestion,
    });

    setTimeout(async () => {
      // TODO: handle users submit correct answer and emit correct answer
      await this.handleQuestionFinish(roomId, rawGameQuestion);
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

  async handleGameFinish(roomId: string) {
    this.server.to(roomId).emit(RoomServerEvent.ServerEmitWaitGameFinished, {
      message: 'Wait for game finished',
      waitTime: WAIT_TIME_PER_QUESTION,
    });
    const userRanking = await this.roomCacheService.getRoomRanking(roomId);
    setTimeout(() => {
      this.server.to(roomId).emit(RoomServerEvent.ServerEmitGameFinished, {
        userRanking,
      });
      this.roomsRepository.update(
        { id: roomId },
        { status: RoomStatus.Finished },
      );
    }, WAIT_TIME_PER_QUESTION * 1000);
  }

  async handleQuestionFinish(
    roomId: string,
    rawGameQuestion: RawGameQuestionDto,
  ) {
    // Emit correct answer to room
    this.server.to(roomId).emit(RoomServerEvent.ServerEmitCorrectAnswer, {
      questionId: rawGameQuestion.id,
      correctIndex: rawGameQuestion.correctIndex,
    });

    const totalQuestions =
      await this.roomCacheService.getTotalRoomQuestion(roomId);
    const finishedQuestions =
      await this.roomCacheService.getCountQuestionAnswered(roomId);

    if (totalQuestions === finishedQuestions) {
      // TODO: Emit game finished if all questions finished
      await this.handleGameFinish(roomId);
    }
    // ?: Emit next question if not finished
    const userRanking = await this.roomCacheService.getRoomRanking(roomId);
    this.server.to(roomId).emit(RoomServerEvent.ServerEmitUserRanking, {
      userRanking,
    });

    const nextQuestion = await this.pickQuestionForRoom(roomId);
    if (nextQuestion) {
      this.server.to(roomId).emit(RoomServerEvent.ServerEmitWaitNextQuestion, {
        message: 'Wait for next question',
        waitTime: WAIT_TIME_PER_QUESTION,
      });
      setTimeout(async () => {
        await this.emitQuestionToRoom(roomId, nextQuestion);
      }, WAIT_TIME_PER_QUESTION * 1000);
    }
  }
}
