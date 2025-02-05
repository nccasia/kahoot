import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  userName: string;
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  password: string;
}
