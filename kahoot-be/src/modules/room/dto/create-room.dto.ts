import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateIf } from 'class-validator';
import { Room } from '../entities/room.entity';
import { MezonChannel } from '../types/channel.type';

export class CreateRoomDto extends PickType(Room, ['gameId']) {}
export class CreateScheduleRoomDto extends CreateRoomDto {
  @ApiProperty({ type: Date })
  @IsNotEmpty()
  @Expose()
  scheduledAt: Date;

  @ApiProperty({ type: Boolean, default: false })
  @IsNotEmpty()
  @Expose()
  isNotifyEnabled?: boolean;

  @ApiProperty({ type: String })
  @ValidateIf((o) => o.isNotifyEnabled === true)
  @IsNotEmpty()
  @Expose()
  clanId?: string;

  @ApiProperty({ type: String })
  @ValidateIf((o) => o.isNotifyEnabled === true)
  @IsNotEmpty()
  @Expose()
  channelId?: string;

  @ApiProperty({ type: String })
  @ValidateIf((o) => o.isNotifyEnabled === true)
  @IsNotEmpty()
  @Expose()
  textMessage?: string;

  @ApiProperty({ type: MezonChannel, isArray: true })
  @ValidateIf((o) => o.isNotifyEnabled === true)
  @IsNotEmpty()
  @IsArray()
  @Expose()
  channels?: MezonChannel[];
}

export class UpdateScheduleRoomDto {
  @ApiProperty({ type: Date })
  @IsNotEmpty()
  @Expose()
  scheduledAt: Date;

  @ApiProperty({ type: Boolean, default: false })
  @IsNotEmpty()
  @Expose()
  isNotifyEnabled?: boolean;

  @ApiProperty({ type: String })
  @ValidateIf((o) => o.isNotifyEnabled === true)
  @IsNotEmpty()
  @Expose()
  textMessage?: string;

  @ApiProperty({ type: MezonChannel, isArray: true })
  @ValidateIf((o) => o.isNotifyEnabled === true)
  @IsNotEmpty()
  @IsArray()
  @Expose()
  channels?: MezonChannel[];
}
