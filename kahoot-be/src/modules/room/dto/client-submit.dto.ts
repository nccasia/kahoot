import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ClientSubmitDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  questionId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  answerIndex: number;
}
