import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { AccessTokenPayload } from '@modules/auth/types';
import { QueryOptionsHelper } from '@base/decorators/query-options.decorator';

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

  async getGames(payload: AccessTokenPayload) {
    const { userId } = payload;

    const games = await this.gamesRepository.find({
      where: { ownerId: userId },
    });

    return games;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
