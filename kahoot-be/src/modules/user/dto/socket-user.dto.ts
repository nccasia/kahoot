import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class MezonUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  mezonUserId: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  userName: string;
  @ApiProperty()
  @Expose()
  avatar?: string;
}

export class SocketUser extends MezonUserDto {
  userId: string;
}
