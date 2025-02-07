import { QueryOptionsHelper } from '@base/decorators/query-options.decorator';
import { QueryOptionsDto } from '@base/dtos/query-options.dto';
import { ERROR_CODES } from '@constants';
import { AccessTokenPayload } from '@modules/auth/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { BaseGameDto } from './dto/base-game.dto';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
  ) {}

  async createGameAsync(
    createGameDto: CreateGameDto,
    payload: AccessTokenPayload,
  ) {
    const { userId } = payload;
    const game = this.gamesRepository.create({
      ...createGameDto,
      ownerId: userId,
    });
    await this.gamesRepository.save(game);
    return plainToInstance(BaseGameDto, game, {
      excludeExtraneousValues: true,
    });
  }

  async getGamesAsync(
    payload: AccessTokenPayload,
    queryOptionsDto: QueryOptionsDto,
  ) {
    const { getPagination, skip, take } = new QueryOptionsHelper(
      queryOptionsDto,
    );
    const { userId } = payload;

    const [rawGames, count] = await this.gamesRepository
      .createQueryBuilder('g')
      .where('g.ownerId = :userId', { userId })
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const resPagination = getPagination({
      count,
      total: rawGames.length,
    });
    const games = rawGames.map((game) =>
      plainToInstance(
        BaseGameDto,
        {
          ...game,
          isOwner: game.ownerId === userId,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
    return { data: games, pagination: resPagination };
  }

  async getGameAsync(gameId: string) {
    const game = await this.gamesRepository.findOne({
      where: { id: gameId },
    });
    if (!game)
      throw new BadRequestException({
        message: `Game with id ${gameId} not found`,
        errorCode: ERROR_CODES.GAME.GAME_NOT_FOUND,
      });
    return plainToInstance(BaseGameDto, game, {
      excludeExtraneousValues: true,
    });
  }

  async updateGameAsync(
    gameId: string,
    updateGameDto: UpdateGameDto,
    payload: AccessTokenPayload,
  ) {
    const game = await this.gamesRepository.findOne({
      where: { id: gameId, ownerId: payload.userId },
    });
    // TODO constant message + errorCode
    if (!game)
      throw new BadRequestException({
        message: `Game with id ${gameId} not found or you are not the owner`,
        errorCode: ERROR_CODES.GAME.GAME_NOT_FOUND,
      });
    const updatedGame = await this.gamesRepository.save({
      ...game,
      ...updateGameDto,
    });
    return plainToInstance(BaseGameDto, updatedGame, {
      excludeExtraneousValues: true,
    });
  }

  async removeGameAsync(gameId: string, payload: AccessTokenPayload) {
    const game = await this.gamesRepository.findOne({
      where: { id: gameId, ownerId: payload.userId },
    });
    if (!game)
      throw new BadRequestException({
        message: `Game with id ${gameId} not found or you are not the owner`,
        errorCode: ERROR_CODES.GAME.GAME_NOT_FOUND,
      });
    await this.gamesRepository.delete(game);
    return { message: `Game with id ${gameId} has been deleted` };
  }
}
