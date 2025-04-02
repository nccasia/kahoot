import { UserWs } from '@base/decorators/user-ws.decorator';
import { WsJwtGuard } from '@base/guards/ws-auth.guard';
import { WSAuthMiddleware } from '@base/middlewares/ws-auth.middleware';
import {
  NAME_SPACE_JOIN_GAME,
  RECONNECT_WAIT_TIME,
  WAIT_TIME_PER_QUESTION,
} from '@constants';
import { GameQuestionDto } from '@modules/question/dto/game-question.dto';
import { RawGameQuestionDto } from '@modules/question/dto/raw-game-question.dto';
import { Question } from '@modules/question/entities/question.entity';
import {
  MultipleChoiceAnswerOptionsDto,
  QuestionMode,
  SingleChoiceAnswerOptionsDto,
} from '@modules/question/types';
import { User } from '@modules/user/entities/user.entity';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
import * as _ from 'lodash';
import { Namespace, Socket } from 'socket.io';
import { corsConfig } from 'src/configs/cors.config';
import { calculatePoint } from 'src/utils';
import { In, Not, Repository } from 'typeorm';
import { validate } from 'uuid';
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
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    @InjectRepository(RoomUser)
    private roomUsersRepository: Repository<RoomUser>,
    @InjectRepository(QuestionRoomUser)
    private questionRoomUsersRepository: Repository<QuestionRoomUser>,
    @InjectRepository(RoomQuestion)
    private roomQuestionsRepository: Repository<RoomQuestion>,
    private roomCacheService: RoomCacheService,
    private jwtService: JwtService,
  ) {}

  async afterInit() {
    this.logger.debug(`[WEBSOCKET RUN] -------`);
    this.server.use(WSAuthMiddleware(this.usersRepository, this.jwtService));
    this.roomsRepository.update(
      { status: RoomStatus.InProgress },
      { status: RoomStatus.Finished },
    );
  }
  // Owner events listeners
  @UseGuards(WsJwtGuard)
  @SubscribeMessage(RoomClientEvent.OwnerStartGame)
  async onOnwerStartGame(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() roomId: string,
  ) {
    if (!roomId || !validate(roomId)) {
      client.emit(ClientConnectionEvent.ClientError, {
        message: 'Invalid room id',
      });
      return;
    }
    const room = await this.roomsRepository.findOne({
      where: { id: String(roomId) },
    });
    if (!room || room.ownerId !== client.user.userId) {
      client.emit(ClientConnectionEvent.ClientError, {
        message: `Room not found or you are not the owner`,
      });
      return;
    }
    if (room.status !== RoomStatus.Waiting) {
      client.emit(ClientConnectionEvent.ClientError, {
        message: `Room cannot be start because it in progess or finished`,
      });
      return;
    }

    const countRoomPlayer = await this.roomCacheService.countRoomUsers(roomId);
    if (countRoomPlayer < 1) {
      client.emit(ClientConnectionEvent.ClientError, {
        message: `Game cannot be start because it has no player`,
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
      totalQuestions: totalQuestions,
      roomId: roomId,
    });

    this.roomCacheService.setTotalRoomQuestion(roomId, totalQuestions);

    setTimeout(async () => {
      await this.emitQuestionToRoom(roomId, firstQuestion);
    }, WAIT_TIME_PER_QUESTION * 1000);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(RoomClientEvent.OwnerFinishGame)
  async onOwnerFinishGame(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() roomId: string,
  ) {
    const room = await this.roomsRepository.findOne({
      where: { id: roomId },
    });
    if (!room || room.ownerId !== client.user.userId) {
      client.emit(ClientConnectionEvent.ClientError, {
        message: `Room not found or you are not the owner`,
      });
      return;
    }
    await this.handleGameFinish(roomId, true);
  }

  // Client or users events listeners
  @UseGuards(WsJwtGuard)
  @SubscribeMessage(RoomClientEvent.ClientEmitJoinRoom)
  async onJoinRoom(
    @MessageBody() joinRoomDto: JoinRoomDto,
    @ConnectedSocket() client: Socket,
    // ? TODO
    @UserWs() user,
  ) {
    const { roomCode } = joinRoomDto;
    const { userId } = user;

    const room: Pick<Room, 'id' | 'status' | 'ownerId' | 'gameId'> & {
      roomUsers: Pick<RoomUser, 'id' | 'userId'>[];
    } = await this.roomsRepository.findOne({
      where: { code: String(roomCode) },
      relations: ['roomUsers'],
      select: ['id', 'status', 'ownerId', 'gameId'],
    });
    if (!room) {
      client.emit(ClientConnectionEvent.ClientError, {
        message: `Room with code ${roomCode} not found`,
      });
      return;
    }

    const memberIds = room.roomUsers.map((ru) => ru.userId);
    const joined = memberIds.some((member) => member === userId);
    const isOwner = room.ownerId === userId;

    if (!joined) {
      if (room?.status !== RoomStatus.Waiting) {
        client.emit(ClientConnectionEvent.ClientError, {
          message: `Room code ${roomCode} cannot be join because it in progess or finished`,
        });

        return;
      }
      await this.roomUsersRepository.insert({
        roomId: room.id,
        userId,
        isOwner: isOwner,
      });
    } else {
      this.roomUsersRepository.update(
        { roomId: room.id, userId: userId },
        { isLeave: false },
      );
    }

    const isJoined = await this.roomCacheService.isJoinedRoom(room.id, userId);
    if (!isJoined && !isOwner) {
      await this.roomCacheService.setRoomUser(room.id, user);
    }
    const socketMembers = await this.roomCacheService.getRoomUsers(room.id);

    await client.join(room.id);
    client.emit(RoomServerEvent.UserJoinedRoom, {
      gameId: room?.gameId,
      roomId: room?.id,
      isOwner: isOwner,
      members: socketMembers,
    });

    !isOwner &&
      this.server
        .to(room.id)
        .emit(RoomServerEvent.ServerEmitUserJoinRoom, user);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(RoomClientEvent.ClientEmitLeaveRoom)
  async onLeaveRoom(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() roomId: string,
  ) {
    if (!roomId || !validate(roomId)) {
      client.emit(ClientConnectionEvent.ClientError, {
        message: 'Invalid room id',
      });
      return;
    }
    this.roomUsersRepository.update(
      { roomId, userId: client.user.userId },
      { isLeave: true },
    );

    client.emit(RoomServerEvent.UserLeftRoom, {
      roomId: roomId,
    });

    this.roomCacheService.removeRoomUser(roomId, client.user);
    client.leave(roomId);
    this.server.to(roomId).emit(RoomServerEvent.ServerEmitLeaveRoom, {
      userId: client.user.userId,
    });
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
    const submitTime = new Date();
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

    let isCorrect = false;
    switch (currentGameQuestion.mode) {
      case QuestionMode.SingleChoice:
        isCorrect = currentGameQuestion.correctIndex === submitDto.answerIndex;
        break;

      case QuestionMode.MultipleChoice:
        isCorrect =
          currentGameQuestion.correctIndexs &&
          currentGameQuestion.correctIndexs.length > 0 &&
          currentGameQuestion.correctIndexs.every((index) => {
            return submitDto.answerIndexes?.includes(index);
          });
        break;

      case QuestionMode.Text:
        isCorrect =
          currentGameQuestion.answerText?.toLowerCase() ===
          submitDto.answerText?.toLowerCase();
        break;

      default:
        client.emit(ClientConnectionEvent.ClientError, {
          message: 'Invalid question mode',
        });
        return;
    }

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
      return;
    }

    const questionPoint = calculatePoint(
      submitTime,
      new Date(currentGameQuestion.startTime),
      isCorrect,
    );

    let newSubmitResult: QuestionRoomUser;
    switch (currentGameQuestion.mode) {
      case QuestionMode.SingleChoice:
        newSubmitResult = this.questionRoomUsersRepository.create({
          roomId: submitDto.roomId,
          userId: client.user.userId,
          questionId: currentGameQuestion.id,
          isCorrect,
          point: questionPoint,
          answerIndex: submitDto.answerIndex,
          submittedAt: submitTime.toISOString(),
        });
        break;

      case QuestionMode.MultipleChoice:
        newSubmitResult = this.questionRoomUsersRepository.create({
          roomId: submitDto.roomId,
          userId: client.user.userId,
          questionId: currentGameQuestion.id,
          isCorrect,
          point: questionPoint,
          answerIndexs: submitDto.answerIndexes,
          submittedAt: submitTime.toISOString(),
        });
        break;

      case QuestionMode.Text:
        newSubmitResult = this.questionRoomUsersRepository.create({
          roomId: submitDto.roomId,
          userId: client.user.userId,
          questionId: currentGameQuestion.id,
          isCorrect,
          point: questionPoint,
          answerText: submitDto.answerText,
          submittedAt: submitTime.toISOString(),
        });
      default:
        client.emit(ClientConnectionEvent.ClientError, {
          message: 'Invalid question mode',
        });
        return;
    }

    await this.roomCacheService.setUserAnswer(submitDto.roomId, {
      ...newSubmitResult,
      userName: client.user.userName,
      avatar: client.user.avatar,
    });
    this.questionRoomUsersRepository.save(newSubmitResult);

    client.emit(RoomServerEvent.ServerEmitUserSubmited, {
      submitedQuestionId: currentGameQuestion.id,
      submitedTime: newSubmitResult.submittedAt,
      message: 'You have submitted answer',
    });

    // TODO: If all users submitted answer, emit correct answer
    const countRoomUsers = await this.roomCacheService.countRoomUsers(
      submitDto.roomId,
    );
    const countSubmitedUser = await this.roomCacheService.countSubmitedUser(
      submitDto.roomId,
      currentGameQuestion.id,
    );

    this.server
      .to(submitDto.roomId)
      .emit(RoomServerEvent.ServerEmitNewUserSubmited, {
        submitedUser: countSubmitedUser,
      });

    if (countRoomUsers === countSubmitedUser) {
      await this.handleQuestionFinish(
        submitDto.roomId,
        currentGameQuestion,
        true,
      );
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

    const playingRoom = await this.roomUsersRepository.findOne({
      where: {
        userId: client.user.userId,
        isLeave: false,
        room: {
          status: Not(RoomStatus.Finished),
        },
      },
      relations: ['user', 'room'],
    });

    if (playingRoom) {
      !playingRoom.isOwner &&
        (await this.roomCacheService.setRoomUser(
          playingRoom?.roomId,
          client.user,
        ));

      await this.roomUsersRepository.update(
        { roomId: playingRoom.roomId, userId: client.user.userId },
        { isLeave: false },
      );

      const socketMembers = await this.roomCacheService.getRoomUsers(
        playingRoom?.roomId,
      );

      await client.join(playingRoom.roomId);
      client.emit(RoomServerEvent.UserReconnectedRoom, {
        gameId: playingRoom?.room?.gameId,
        roomId: playingRoom?.roomId,
        roomCode: playingRoom?.room?.code,
        roomStatus: playingRoom?.room?.status,
        isOwner: playingRoom?.isOwner,
        members: socketMembers,
      });

      !playingRoom.isOwner &&
        this.server
          .to(playingRoom.roomId)
          .emit(RoomServerEvent.ServerEmitUserJoinRoom, client.user);

      if (playingRoom.room.status === RoomStatus.InProgress) {
        setTimeout(async () => {
          const currentRoomQuestion =
            await this.roomCacheService.getCurrentQuestion(playingRoom.roomId);

          const lastTotalPoint = await this.roomCacheService.getUserTotalPoint(
            playingRoom.roomId,
            client.user.userId,
          );

          if (!currentRoomQuestion) {
            client.emit(RoomServerEvent.ServerEmitWaitNextQuestion, {
              message:
                'Question has been finished, please wait for next question',
              lastTotalPoint: lastTotalPoint,
            });
            return;
          }

          const gameQuestion = plainToInstance(
            GameQuestionDto,
            currentRoomQuestion,
            {
              excludeExtraneousValues: true,
            },
          );

          const submitedAnswer =
            await this.roomCacheService.getUserSubmittedAnswer(
              playingRoom.roomId,
              currentRoomQuestion.id,
              client.user.userId,
            );

          client.emit(RoomServerEvent.ServerEmitCurrentQuestion, {
            currentQuestion: gameQuestion,
            lastTotalPoint: lastTotalPoint,
            submitedAnswer: submitedAnswer
              ? {
                  answerIndex: submitedAnswer.answerIndex,
                  submitedAt: submitedAnswer.submittedAt,
                  submitedQuestionId: submitedAnswer.questionId,
                }
              : null,
          });
        }, RECONNECT_WAIT_TIME * 1000);
      }
    }

    client.on('disconnecting', async () => {
      // filter room myself
      const currentRoomIds = await this.roomUsersRepository.find({
        where: {
          userId: client.user.userId,
          isLeave: false,
          room: { status: Not(RoomStatus.Finished) },
        },
        relations: ['room'],
        select: ['roomId'],
      });

      if (currentRoomIds) {
        currentRoomIds.forEach(async (room) => {
          this.roomCacheService.removeRoomUser(room.roomId, client.user);
          this.server
            .to(room.roomId)
            .emit(RoomServerEvent.ServerEmitLeaveRoom, {
              userId: client.user.userId,
            });
        });
      }

      this.roomCacheService.modifyCacheSocketUser({
        socketId: client.id,
        userId: client.user.userId,
        type: StatusModifyCache.Delete,
      });
    });
  }

  async handleDisconnect(client: UserSocket) {
    this.logger.log({
      message: `Client disconnected: ${client.id}`,
    });
  }

  // Game handlers
  async emitQuestionToRoom(roomId: string, question: Question) {
    const roomQuestion = this.roomQuestionsRepository.create({
      roomId,
      questionId: question.id,
      startTime: new Date().toISOString(),
      endTime: new Date(
        new Date().getTime() + question.time * 1000,
      ).toISOString(),
    });
    await this.roomQuestionsRepository.save(roomQuestion);

    const rawGameQuestion = plainToInstance(RawGameQuestionDto, {
      ...question,
      correctIndex:
        question.mode === QuestionMode.SingleChoice &&
        (question.answerOptions as SingleChoiceAnswerOptionsDto)?.correctIndex,
      correctIndexs:
        question.mode === QuestionMode.MultipleChoice &&
        (question.answerOptions as MultipleChoiceAnswerOptionsDto)
          ?.correctIndexes,
      answerText: question.mode === QuestionMode.Text && question.answerText,
      startTime: roomQuestion.startTime,
      endTime: roomQuestion.endTime,
    });

    const gameQuestion = plainToInstance(
      GameQuestionDto,
      {
        ...rawGameQuestion,
        answerOptions: question.mode !== QuestionMode.Text && {
          options: rawGameQuestion?.answerOptions?.options,
        },
      },
      {
        excludeExtraneousValues: true,
      },
    );
    // Save question to cache
    await this.roomCacheService.setCurrentQuestion(
      roomId,
      rawGameQuestion,
      question.time,
    );
    /**
     * Emit question withthout correct answer to room
     */
    const finishedQuestions =
      await this.roomCacheService.countFinishedQuestion(roomId);
    this.server.to(roomId).emit(RoomServerEvent.ServerEmitQuestion, {
      question: gameQuestion,
      questionNumber: finishedQuestions + 1,
    });

    const questionTimeoutId = setTimeout(async () => {
      //? handle users submit correct answer and emit correct answer
      await this.handleQuestionFinish(roomId, rawGameQuestion);
    }, question.time * 1000);

    this.roomCacheService.setQuestionTimeout(
      roomId,
      question.id,
      question.time,
      questionTimeoutId,
    );
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

  async handleGameFinish(roomId: string, isOwnerFinish: boolean = false) {
    if (isOwnerFinish) {
      const currentGameQuestion =
        await this.roomCacheService.getCurrentQuestion(roomId);

      if (currentGameQuestion) {
        const timeoutId = await this.roomCacheService.getQuestionTimeout(
          roomId,
          currentGameQuestion.id,
        );
        timeoutId && clearTimeout(timeoutId);

        const questionAnalysis =
          await this.roomCacheService.getQuestionAnalysis(
            roomId,
            currentGameQuestion.id,
          );

        // Emit question finished to each user
        const submitedUsers =
          await this.roomCacheService.getQuestionUserAnswered(
            roomId,
            currentGameQuestion.id,
          );

        submitedUsers.forEach(async (user) => {
          const userSocketIds = await this.roomCacheService.getSocketUser(
            user.userId,
          );
          const onlineSocketId = _.findLast(userSocketIds, (socket) => {
            return this.server.sockets.get(socket) !== undefined;
          });
          if (onlineSocketId) {
            const userSocket = this.server.sockets.get(onlineSocketId);
            const questionResult = await this.roomCacheService.getUserPoint(
              roomId,
              currentGameQuestion.id,
              user.userId,
            );
            userSocket.emit(
              RoomServerEvent.ServerEmitQuestionFinished,
              questionResult,
            );
          }
        });

        // Emit correct answer to room
        switch (currentGameQuestion.mode) {
          case QuestionMode.SingleChoice:
            this.server
              .to(roomId)
              .emit(RoomServerEvent.ServerEmitCorrectAnswer, {
                questionMode: currentGameQuestion.mode,
                questionId: currentGameQuestion.id,
                totalOptions:
                  currentGameQuestion?.answerOptions?.options?.length,
                correctIndex: currentGameQuestion?.correctIndex,
                questionAnalysis: questionAnalysis,
              });
            break;

          case QuestionMode.MultipleChoice:
            this.server
              .to(roomId)
              .emit(RoomServerEvent.ServerEmitCorrectAnswer, {
                questionMode: currentGameQuestion.mode,
                questionId: currentGameQuestion.id,
                totalOptions:
                  currentGameQuestion?.answerOptions?.options?.length,
                correctIndexs: currentGameQuestion?.correctIndexs,
                questionAnalysis: questionAnalysis,
              });
            break;

          case QuestionMode.Text:
            this.server
              .to(roomId)
              .emit(RoomServerEvent.ServerEmitCorrectAnswer, {
                questionMode: currentGameQuestion.mode,
                questionId: currentGameQuestion.id,
                totalOptions:
                  currentGameQuestion?.answerOptions?.options?.length,
                correctText: currentGameQuestion?.answerText,
                questionAnalysis: questionAnalysis,
              });
            break;

          default:
            break;
        }
      }
    }

    this.server.to(roomId).emit(RoomServerEvent.ServerEmitWaitGameFinished, {
      message: 'Wait for game finished',
      waitTime: WAIT_TIME_PER_QUESTION,
    });

    const totalQuestions =
      await this.roomCacheService.getTotalRoomQuestion(roomId);
    const userRanking = await this.roomCacheService.getRoomRanking(
      roomId,
      false,
    );

    setTimeout(() => {
      this.server.to(roomId).emit(RoomServerEvent.ServerEmitGameFinished, {
        userRanking,
        totalQuestions,
      });
      this.roomsRepository.update(
        { id: roomId },
        { status: RoomStatus.Finished },
      );

      this.roomCacheService.clearRoomCache(roomId);
    }, WAIT_TIME_PER_QUESTION * 1000);
  }

  async handleQuestionFinish(
    roomId: string,
    rawGameQuestion: RawGameQuestionDto,
    isAllUserSubmited: boolean = false,
  ) {
    if (isAllUserSubmited) {
      const timeoutId = await this.roomCacheService.getQuestionTimeout(
        roomId,
        rawGameQuestion.id,
      );
      timeoutId && clearTimeout(timeoutId);
    }

    const questionAnalysis = await this.roomCacheService.getQuestionAnalysis(
      roomId,
      rawGameQuestion.id,
    );

    // Emit question finished to each user
    const submitedUsers = await this.roomCacheService.getQuestionUserAnswered(
      roomId,
      rawGameQuestion.id,
    );

    submitedUsers.forEach(async (user) => {
      const userSocketIds = await this.roomCacheService.getSocketUser(
        user.userId,
      );
      const onlineSocketId = _.findLast(userSocketIds, (socket) => {
        return this.server.sockets.get(socket) !== undefined;
      });
      if (onlineSocketId) {
        const userSocket = this.server.sockets.get(onlineSocketId);
        const questionResult = await this.roomCacheService.getUserPoint(
          roomId,
          rawGameQuestion.id,
          user.userId,
        );
        userSocket.emit(
          RoomServerEvent.ServerEmitQuestionFinished,
          questionResult,
        );
      }
    });

    // Emit correct answer to room
    switch (rawGameQuestion.mode) {
      case QuestionMode.SingleChoice:
        this.server.to(roomId).emit(RoomServerEvent.ServerEmitCorrectAnswer, {
          questionMode: rawGameQuestion.mode,
          questionId: rawGameQuestion.id,
          totalOptions: rawGameQuestion?.answerOptions?.options?.length,
          correctIndex: rawGameQuestion?.correctIndex,
          questionAnalysis: questionAnalysis,
        });
        break;

      case QuestionMode.MultipleChoice:
        this.server.to(roomId).emit(RoomServerEvent.ServerEmitCorrectAnswer, {
          questionMode: rawGameQuestion.mode,
          questionId: rawGameQuestion.id,
          totalOptions: rawGameQuestion?.answerOptions?.options?.length,
          correctIndexs: rawGameQuestion?.correctIndexs,
          questionAnalysis: questionAnalysis,
        });
        break;

      case QuestionMode.Text:
        this.server.to(roomId).emit(RoomServerEvent.ServerEmitCorrectAnswer, {
          questionMode: rawGameQuestion.mode,
          questionId: rawGameQuestion.id,
          totalOptions: rawGameQuestion?.answerOptions?.options?.length,
          correctText: rawGameQuestion?.answerText,
          questionAnalysis: questionAnalysis,
        });
        break;

      default:
        break;
    }

    await this.roomCacheService.setFinishedQuestion(roomId, rawGameQuestion.id);
    const totalQuestions =
      await this.roomCacheService.getTotalRoomQuestion(roomId);
    const finishedQuestions =
      await this.roomCacheService.countFinishedQuestion(roomId);
    const userRanking = await this.roomCacheService.getRoomRanking(roomId);
    await this.roomCacheService.removeCurrentQuestion(roomId);

    if (totalQuestions === finishedQuestions) {
      this.server.to(roomId).emit(RoomServerEvent.ServerEmitUserRanking, {
        userRanking,
        totalQuestions,
      });
      // TODO: Emit game finished if all questions finished
      await this.handleGameFinish(roomId);
      return;
    }
    // ?: Emit next question if not finished

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
