import { IsNotEmpty } from 'class-validator';

export class JoinRoomDto {
  @IsNotEmpty()
  roomCode: string;
}
