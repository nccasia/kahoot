import { PartialType, PickType } from '@nestjs/swagger';
import { Game } from '../entities/game.entity';

export class CreateGameDto extends PickType(Game, [
  'name',
  'description',
  'status',
]) {}
