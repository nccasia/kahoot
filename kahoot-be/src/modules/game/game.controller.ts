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
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameService } from './game.service';
import { ResponseCreateGame, ResponseGetGame } from './types/game.response';

@ApiTags('games')
@Auth()
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiResponseType(ResponseCreateGame)
  @Post()
  createGame(
    @Body() createGameDto: CreateGameDto,
    @UserRequest() payload: AccessTokenPayload,
  ) {
    return this.gameService.createGameAsync(createGameDto, payload);
  }

  @ApiQueryOptions()
  @ApiResponseType(ResponseGetGame, { isArray: true })
  @Get()
  getGames(
    @UserRequest() payload: AccessTokenPayload,
    @QueryOptions() queryOptionsDto: QueryOptionsDto,
  ) {
    return this.gameService.getGamesAsync(payload, queryOptionsDto);
  }

  @ApiResponseType(ResponseGetGame, { isArray: true })
  @Get(':gameId')
  getGame(@Param('gameId') gameId: string) {
    return this.gameService.getGameAsync(gameId);
  }

  @ApiResponseType(ResponseGetGame)
  @Put(':gameId')
  updateGame(
    @Param('gameId') gameId: string,
    @UserRequest() payload: AccessTokenPayload,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    return this.gameService.updateGameAsync(gameId, updateGameDto, payload);
  }

  @Delete(':gameId')
  removeGame(
    @Param('gameId') gameId: string,
    @UserRequest() payload: AccessTokenPayload,
  ) {
    return this.gameService.removeGameAsync(gameId, payload);
  }
}
