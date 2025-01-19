import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { AccessTokenPayload } from '@modules/auth/types';
import { QueryOptionsHelper } from '@base/decorators/query-options.decorator';
import { QueryOptionsDto } from '@base/dtos/query-options.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
  ) {}

  async create(createGameDto: CreateGameDto, payload: AccessTokenPayload) {
    const { userId } = payload;
    const game = this.gamesRepository.create({
      ...createGameDto,
      ownerId: userId,
    });
    await this.gamesRepository.save(game);
    return game;
  }

  async getGames(
    payload: AccessTokenPayload,
    queryOptionsDto: QueryOptionsDto,
  ) {
    const { getPagination, skip, take } = new QueryOptionsHelper(
      queryOptionsDto,
    );
    const { userId } = payload;

    const [games, count] = await this.gamesRepository
      .createQueryBuilder('g')
      .where('g.ownerId = :userId', { userId })
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const resPagination = getPagination({
      count,
      total: games.length,
    });

    return { data: games, pagination: resPagination };
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  async update(gameId: string, updateGameDto: UpdateGameDto) {
    const game = await this.gamesRepository.findOne({
      where: { id: gameId },
    });
    // TODO constant message + errorCode
    if (!game) throw new BadRequestException();
    await this.gamesRepository.update({ id: gameId }, updateGameDto);
    return {};
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
