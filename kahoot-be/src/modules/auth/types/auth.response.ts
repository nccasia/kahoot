import { ApiProperty } from '@nestjs/swagger';

export class ResponseLogin {
  @ApiProperty()
  accessToken: string;
}
