import { MezonUserDto } from '@modules/user/dto/socket-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class MezonAuthDto extends MezonUserDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  hashKey: string;
}

export class HashDto {
  @IsString()
  @Expose()
  userid: string;
  @IsString()
  @Expose()
  username: string;
}
