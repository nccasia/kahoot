import { PickType } from '@nestjs/swagger';
import { Room } from '../entities/room.entity';

export class UpdateRoomDto extends PickType(Room, ['name']) {}
