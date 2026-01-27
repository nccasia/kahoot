import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

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
  @IsUrl()
  avatar?: string;
}

export class MezonHashUser {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  id: string;
  @Expose()
  @IsNotEmpty()
  @IsString()
  mezon_id: string;
  @Expose()
  @IsNotEmpty()
  @IsString()
  username: string;
  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;
  @Expose()
  display_name?: string;
  @Expose()
  avatar_url?: string;
}
export class SocketUser extends MezonUserDto {
  @Expose()
  userId: string;
}
