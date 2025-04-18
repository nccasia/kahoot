import { QueryOptionsHelper } from '@base/decorators/query-options.decorator';
import { QueryOptionsDto } from '@base/dtos/query-options.dto';
import { ERROR_CODES } from '@constants';
import { AccessTokenPayload } from '@modules/auth/types';
import { Game } from '@modules/game/entities/game.entity';
import { MezonClientService } from '@modules/shared/mezon/mezon-client.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import schedule from 'node-schedule';
import { generateRoomCode } from 'src/utils';
import { Repository } from 'typeorm';
import { BaseRoomDto, BaseScheduledRoomDto } from './dto/base-room.dto';
import {
  CreateRoomDto,
  CreateScheduleRoomDto,
  UpdateScheduleRoomDto,
} from './dto/create-room.dto';
import { Room } from './entities/room.entity';
import { RoomStatus } from './types';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Game)
    private readonly gamesRepository: Repository<Game>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly mezonClientService: MezonClientService,
  ) {}

  async createRoomAsync(
    createRoomDto: CreateRoomDto,
    payload: AccessTokenPayload,
  ) {
    const game = this.gamesRepository.findOne({
      where: { id: createRoomDto.gameId, ownerId: payload.userId },
    });
    if (!game)
      throw new BadRequestException({
        message: `Game with id ${createRoomDto.gameId} not found or you are not the owner`,
        errorCode: ERROR_CODES.GAME.GAME_NOT_FOUND,
      });

    const roomCode = generateRoomCode();
    const room = this.roomRepository.create({
      ...createRoomDto,
      ownerId: payload.userId,
      status: RoomStatus.Waiting,
      code: roomCode,
    });
    await this.roomRepository.save(room);
    return plainToInstance(
      BaseRoomDto,
      {
        ...room,
        isOnwer: room.ownerId === payload.userId,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async createScheduleRoomAsync(
    createRoomDto: CreateScheduleRoomDto,
    payload: AccessTokenPayload,
  ) {
    const game = this.gamesRepository.findOne({
      where: { id: createRoomDto.gameId, ownerId: payload.userId },
    });
    if (!game)
      throw new BadRequestException({
        message: `Game not found or you are not the owner`,
        errorCode: ERROR_CODES.GAME.GAME_NOT_FOUND,
      });

    const roomCode = generateRoomCode();
    const room = this.roomRepository.create({
      ...createRoomDto,
      ownerId: payload.userId,
      status: RoomStatus.Scheduled,
      code: roomCode,
    });
    await this.roomRepository.save(room);

    const scheduleTime = new Date(createRoomDto.scheduledAt);

    schedule.scheduleJob(room.id, scheduleTime, async () => {
      //? Implement the logic to start the game here
      //? For example, you can update the room status to "Waiting"
      console.log(
        `Room with id ${room.id} has been scheduled at ${scheduleTime}`,
      );
      await this.roomRepository.update(
        { id: room.id },
        { status: RoomStatus.Waiting },
      );
    });
    return plainToInstance(
      BaseScheduledRoomDto,
      {
        ...room,
        isOnwer: room.ownerId === payload.userId,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getScheduledRoomAsync(roomId: string, payload: AccessTokenPayload) {
    const room = await this.roomRepository.findOne({
      where: { id: roomId, ownerId: payload.userId },
    });
    if (!room)
      throw new BadRequestException({
        message: `Room not found or you are not the owner`,
        errorCode: ERROR_CODES.ROOM.ROOM_NOT_FOUND,
      });
    return plainToInstance(
      BaseScheduledRoomDto,
      {
        ...room,
        isOnwer: room.ownerId === payload.userId,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async updateScheduledRoomAsync(
    roomId: string,
    updateRoomDto: UpdateScheduleRoomDto,
    payload: AccessTokenPayload,
  ) {
    const room = await this.roomRepository.findOne({
      where: { id: roomId, ownerId: payload.userId },
    });
    if (!room)
      throw new BadRequestException({
        message: `Room not found or you are not the owner`,
        errorCode: ERROR_CODES.ROOM.ROOM_NOT_FOUND,
      });

    if (room.status !== RoomStatus.Scheduled) {
      throw new BadRequestException({
        message: `Room cannot be updated because it is not scheduled`,
        errorCode: ERROR_CODES.ROOM.ROOM_CANNOT_BE_UPDATED,
      });
    }
    schedule.cancelJob(room.id);
    const scheduleTime = new Date(updateRoomDto.scheduledAt);
    schedule.scheduleJob(room.id, scheduleTime, async () => {
      //? Implement the logic to start the game here
      console.log(
        `Room with id ${room.id} has been started at ${scheduleTime}`,
      );
    });
    await this.roomRepository.update(
      { id: room.id },
      {
        status: RoomStatus.Scheduled,
        scheduledAt: updateRoomDto.scheduledAt,
        channelIds: updateRoomDto.channelIds,
      },
    );
    return plainToInstance(
      BaseScheduledRoomDto,
      {
        ...room,
        isOnwer: room.ownerId === payload.userId,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async canncelScheduledRoomAsync(roomId: string, payload: AccessTokenPayload) {
    const room = await this.roomRepository.findOne({
      where: { id: roomId, ownerId: payload.userId },
    });
    if (!room)
      throw new BadRequestException({
        message: `Room not found or you are not the owner`,
        errorCode: ERROR_CODES.ROOM.ROOM_NOT_FOUND,
      });

    if (room.status !== RoomStatus.Scheduled) {
      throw new BadRequestException({
        message: `Room cannot be cancelled because it is not scheduled`,
        errorCode: ERROR_CODES.ROOM.ROOM_CANNOT_BE_UPDATED,
      });
    }
    schedule.cancelJob(room.id);
    await this.roomRepository.update(
      { id: room.id },
      { status: RoomStatus.InProgress },
    );
    return { message: `Room scheduled has been cancelled` };
  }

  async getGameRoomsAsync(
    gameId: string,
    payload: AccessTokenPayload,
    queryOptionsDto: QueryOptionsDto,
  ) {
    const game = await this.gamesRepository.findOne({
      where: { id: gameId, ownerId: payload.userId },
    });
    if (!game)
      throw new BadRequestException({
        message: `Game with id ${gameId} not found or you are not the owner`,
        errorCode: ERROR_CODES.GAME.GAME_NOT_FOUND,
      });

    const { getPagination, skip, take } = new QueryOptionsHelper(
      queryOptionsDto,
    );
    const [rawRooms, count] = await this.roomRepository.findAndCount({
      where: { gameId: game.id },
      skip,
      take,
    });

    const resPagination = getPagination({
      count,
      total: rawRooms.length,
    });
    const rooms = rawRooms.map((room) =>
      plainToInstance(
        BaseRoomDto,
        {
          ...room,
          isOwner: room.ownerId === payload.userId,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
    return { data: rooms, pagination: resPagination };
  }

  async getRoomAsync(roomId: string, payload: AccessTokenPayload) {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });
    if (!room)
      throw new BadRequestException({
        message: `Room with id ${roomId} not found`,
        errorCode: ERROR_CODES.ROOM.ROOM_NOT_FOUND,
      });
    return plainToInstance(
      BaseRoomDto,
      { ...room, isOwner: room.ownerId == payload.userId },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  // async startGameAsync(roomId: string, payload: AccessTokenPayload) {
  //   const room = await this.roomRepository.findOne({
  //     where: { id: roomId, ownerId: payload.userId },
  //   });
  //   if (!room) {
  //     throw new BadRequestException({
  //       message: `Room with id ${roomId} not found or you are not the owner`,
  //       errorCode: ERROR_CODES.ROOM.ROOM_NOT_FOUND,
  //     });
  //   }
  //   if (room.status !== RoomStatus.Created) {
  //     throw new BadRequestException({
  //       message: `Room with id ${roomId} cannot be started because it is playing or finished`,
  //       errorCode: ERROR_CODES.ROOM.ROOM_CANNOT_BE_UPDATED,
  //     });
  //   }
  //   await this.roomRepository.update(
  //     { id: roomId },
  //     { status: RoomStatus.Waiting },
  //   );
  //   return { message: `Room with id ${roomId} has been started` };
  // }
  async removeRoomAsync(roomId: string, payload: AccessTokenPayload) {
    const room = await this.roomRepository.findOne({
      where: { id: roomId, ownerId: payload.userId },
    });
    if (!room) {
      throw new BadRequestException({
        message: `Room with id ${roomId} not found or you are not the owner`,
        errorCode: ERROR_CODES.ROOM.ROOM_NOT_FOUND,
      });
    }
    if (room.status !== RoomStatus.Finished) {
      throw new BadRequestException({
        message: `Room with id ${roomId} cannot be removed because it is playing`,
        errorCode: ERROR_CODES.ROOM.ROOM_CANNOT_BE_DELETED,
      });
    }
    await this.roomRepository.remove(room);
    return { message: `Room with id ${roomId} has been removed` };
  }
}
