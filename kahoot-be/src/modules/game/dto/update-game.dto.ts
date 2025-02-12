import { PickType } from '@nestjs/swagger';
import { Game } from '../entities/game.entity';

export class UpdateGameDto extends PickType(Game, [
  'name',
  'description',
  'status',
]) {}
