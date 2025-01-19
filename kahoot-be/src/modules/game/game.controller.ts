import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Auth } from '@base/decorators/auth.decorator';
import { UserRequest } from '@base/decorators/user-request.decorator';
import { AccessTokenPayload } from '@modules/auth/types';
import { ApiResponseType } from '@base/decorators/response-swagger.decorator';
import { ResponseCreateGame, ResponseGetGame } from './types/game.response';
import { ApiQueryOptions } from '@base/decorators/api-query-options.decorator';
import { QueryOptions } from '@base/decorators/query-options.decorator';
import { QueryOptionsDto } from '@base/dtos/query-options.dto';

@ApiTags('game')
@Auth()
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiResponseType(ResponseCreateGame)
  @Post()
  create(
    @Body() createGameDto: CreateGameDto,
    @UserRequest() payload: AccessTokenPayload,
  ) {
    return this.gameService.create(createGameDto, payload);
  }

  @ApiQueryOptions()
  @ApiResponseType(ResponseGetGame, { isArray: true })
  @Get()
  getGames(
    @UserRequest() payload: AccessTokenPayload,
    @QueryOptions() queryOptionsDto: QueryOptionsDto,
  ) {
    return this.gameService.getGames(payload, queryOptionsDto);
  }

  @Patch(':gameId')
  update(
    @Param('gameId') gameId: string,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    return this.gameService.update(gameId, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(+id);
  }
}
