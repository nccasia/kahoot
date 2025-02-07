import { Expose } from 'class-transformer';

export class MezonUserDto {
  @Expose()
  mezonUserId: string;
  @Expose()
  email: string;
  @Expose()
  userName: string;
  @Expose()
  avatar: string;
}

export class SocketUser extends MezonUserDto {
  userId?: string | null;
}
