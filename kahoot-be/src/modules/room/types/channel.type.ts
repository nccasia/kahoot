import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum ChannelType {
  CHANNEL_TYPE_CHANNEL = 1,
  CHANNEL_TYPE_GROUP = 2,
  CHANNEL_TYPE_DM = 3,
  CHANNEL_TYPE_GMEET_VOICE = 4,
  CHANNEL_TYPE_FORUM = 5,
  CHANNEL_TYPE_STREAMING = 6,
  CHANNEL_TYPE_THREAD = 7,
  CHANNEL_TYPE_APP = 8,
  CHANNEL_TYPE_ANNOUNCEMENT = 9,
  CHANNEL_TYPE_MEZON_VOICE = 10,
}

export const ChannelTypeMapper = {
  [ChannelType.CHANNEL_TYPE_CHANNEL]: 2,
  [ChannelType.CHANNEL_TYPE_GROUP]: 2,
  [ChannelType.CHANNEL_TYPE_DM]: 3,
  [ChannelType.CHANNEL_TYPE_GMEET_VOICE]: 2,
  [ChannelType.CHANNEL_TYPE_FORUM]: 2,
  [ChannelType.CHANNEL_TYPE_STREAMING]: 2,
  [ChannelType.CHANNEL_TYPE_THREAD]: 6,
  [ChannelType.CHANNEL_TYPE_APP]: 2,
  [ChannelType.CHANNEL_TYPE_ANNOUNCEMENT]: 2,
  [ChannelType.CHANNEL_TYPE_MEZON_VOICE]: 2,
};
export class MezonChannel {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  channelId: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  clanId: string;

  @ApiProperty({ type: String })
  channelName?: string;

  @ApiProperty({ enum: ChannelType, enumName: 'ChannelType' })
  @IsEnum(ChannelType)
  type: ChannelType;

  @ApiProperty({ type: Boolean })
  isPrivateChannel: boolean = false;
}
