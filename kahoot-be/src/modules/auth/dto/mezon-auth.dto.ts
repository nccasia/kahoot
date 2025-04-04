import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MezonAuthDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  hashData: string;
}

export class HashData {
  @IsString()
  @Expose()
  query_id: string;
  @IsString()
  @Expose()
  user: string;
  @IsNumber()
  @Expose()
  auth_date: number;
  @IsString()
  @Expose()
  signature: string;
  @IsString()
  @Expose()
  hash: string;
}
