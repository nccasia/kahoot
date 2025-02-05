import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseLogin {
  @ApiProperty()
  accessToken: string;
}

export class ResponseRegister {
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
}
