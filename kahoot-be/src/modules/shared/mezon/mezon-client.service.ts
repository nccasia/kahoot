import {
  ChannelTypeMapper,
  MezonChannel,
} from '@modules/room/types/channel.type';
import { Injectable, Logger } from '@nestjs/common';
import { MezonClient } from 'mezon-sdk';

@Injectable()
export class MezonClientService {
  private readonly client: MezonClient;
  private logger = new Logger(MezonClientService.name);

  constructor() {
    this.client = new MezonClient(process.env.MEZON_APP_SECRET);
    this.client
      .authenticate()
      .then(() => {
        console.log('Mezon client authenticated successfully');
      })
      .catch((error) => {
        console.error('Error authenticating Mezon client:', error);
      });
  }

  async sendRoomCodeToChanneles(roomCode: string, channels: MezonChannel[]) {
    channels.forEach(async (channel) => {
      try {
        // Check if the channel is a private channel
        await this.client.sendMessage(
          channel.clanId,
          channel.channelId,
          ChannelTypeMapper[channel.type],
          !channel.isPrivateChannel,
          {
            t: `Tham gia trò chơi Đố Bạn cùng NCC: ${roomCode}`,
          },
        );
      } catch (error) {
        this.logger.warn(
          `Error sending message to channel: ${channel.channelName}`,
          error?.message,
        );
      }
    });
  }
}
