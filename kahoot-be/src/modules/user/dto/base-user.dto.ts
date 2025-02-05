import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BaseUserDto {
  @ApiProperty()
  @Expose()
  id: string;
  @ApiProperty()
  @Expose()
  email: string;
  @ApiProperty()
  @Expose()
  userName: string;
  @ApiProperty()
  @Expose()
  createdAt: Date;
  @ApiProperty()
  @Expose()
  updatedAt: Date;
  @ApiProperty()
  @Expose()
  deletedAt: Date;
}
