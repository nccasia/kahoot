import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserRankDto {
  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Expose()
  userName: string;

  @ApiProperty()
  @Expose()
  avatar?: string;

  @ApiProperty()
  @Expose()
  totalPoint: number;

  @ApiProperty()
  @Expose()
  correctRate: number;

  @ApiProperty()
  @Expose()
  totalCorrect: number;

  @ApiProperty()
  @Expose()
  totalWrong: number;
}
