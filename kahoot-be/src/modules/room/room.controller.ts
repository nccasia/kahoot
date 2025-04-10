import { ApiQueryOptions } from '@base/decorators/api-query-options.decorator';
import { Auth } from '@base/decorators/auth.decorator';
import { QueryOptions } from '@base/decorators/query-options.decorator';
import { ApiResponseType } from '@base/decorators/response-swagger.decorator';
import { UserRequest } from '@base/decorators/user-request.decorator';
import { QueryOptionsDto } from '@base/dtos/query-options.dto';
import { AccessTokenPayload } from '@modules/auth/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateRoomDto,
  CreateScheduleRoomDto,
  UpdateScheduleRoomDto,
} from './dto/create-room.dto';
import { RoomService } from './room.service';
import {
  ResponseCreateRoom,
  ResponseGetRoom,
  ResponseGetScheduledRoom,
} from './types/room.response';

@ApiTags('Rooms')
@Auth()
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiResponseType(ResponseCreateRoom)
  @Post()
  createRoom(
    @Body() createRoomDto: CreateRoomDto,
    @UserRequest() payload: AccessTokenPayload,
  ) {
    return this.roomService.createRoomAsync(createRoomDto, payload);
  }

  @ApiResponseType(ResponseGetScheduledRoom)
  @Get('scheduled-rooms/:roomId')
  getScheduledRoom(
    @Param('roomId') roomId: string,
    @UserRequest() payload: AccessTokenPayload,
  ) {
    return this.roomService.getScheduledRoomAsync(roomId, payload);
  }

  @ApiResponseType(ResponseGetScheduledRoom)
  @Post('create-schedule')
  createScheduleRoom(
    @Body() createScheduleRoomDto: CreateScheduleRoomDto,
    @UserRequest() payload: AccessTokenPayload,
  ) {
    return this.roomService.createScheduleRoomAsync(
      createScheduleRoomDto,
      payload,
    );
  }
  @ApiResponseType(ResponseGetScheduledRoom)
  @Put('update-schedule/:roomId')
  updateScheduleRoom(
    @Param('roomId') roomId: string,
    @Body() updateScheduleRoomDto: UpdateScheduleRoomDto,
    @UserRequest() payload: AccessTokenPayload,
  ) {
    return this.roomService.updateScheduledRoomAsync(
      roomId,
      updateScheduleRoomDto,
      payload,
    );
  }
  @ApiResponseType(ResponseGetScheduledRoom)
  @Put('cancel-schedule/:roomId')
  cancelScheduleRoom(
    @Param('roomId') roomId: string,
    @UserRequest() payload: AccessTokenPayload,
  ) {
    return this.roomService.canncelScheduledRoomAsync(roomId, payload);
  }

  @ApiQueryOptions()
  @ApiResponseType(ResponseGetRoom, { isArray: true })
  @Get('game-rooms/:gameId')
  getGameRooms(
    @Param('gameId') gameId: string,
    @UserRequest()
    payload: AccessTokenPayload,
    @QueryOptions() queryOptionsDto: QueryOptionsDto,
  ) {
    return this.roomService.getGameRoomsAsync(gameId, payload, queryOptionsDto);
  }

  @ApiResponseType(ResponseGetRoom)
  @Get(':roomId')
  getRoom(
    @Param('roomId') roomId: string,
    @UserRequest() payload: AccessTokenPayload,
  ) {
    return this.roomService.getRoomAsync(roomId, payload);
  }
  // @Put('start-game/:roomId')
  // startGame(
  //   @Param('roomId') roomId: string,
  //   @UserRequest() payload: AccessTokenPayload,
  // ) {
  //   return this.roomService.startGameAsync(roomId, payload);
  // }
  @Delete(':roomId')
  removeRoom(
    @Param('roomId') roomId: string,
    @UserRequest() payload: AccessTokenPayload,
  ) {
    return this.roomService.removeRoomAsync(roomId, payload);
  }
}
