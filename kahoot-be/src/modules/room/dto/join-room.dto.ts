import { IsNotEmpty, IsUUID } from 'class-validator';

export class JoinRoomDto {
  @IsNotEmpty()
  @IsUUID()
  roomCode: string;
}
