import { User } from '@modules/user/entities/user.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MinLength } from 'class-validator';

export class RegisterDto extends PickType(User, ['userName', 'email']) {
  @ApiProperty()
  @Expose()
  @MinLength(8)
  password: string;
}
