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
import {
  QueryOptions,
  QueryOptionsHelper,
} from '@base/decorators/query-options.decorator';

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
    @QueryOptions() queryOptionsHelper: QueryOptionsHelper,
  ) {
    return this.gameService.getGames(payload, queryOptionsHelper);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(+id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(+id);
  }
}
