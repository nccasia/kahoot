import { PickType } from '@nestjs/swagger';
import { Room } from '../entities/room.entity';

export class CreateRoomDto extends PickType(Room, ['gameId']) {}
