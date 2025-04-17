import {
  ChannelTypeMapper,
  MezonChannel,
} from '@modules/room/types/channel.type';
import { Injectable, Logger } from '@nestjs/common';
import { MezonClient } from 'mezon-sdk';
import * as QRCode from 'qrcode';

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

  async sendEventChanneles(
    roomCode: string,
    channels: MezonChannel[],
    clanId?: string,
    channelId?: string,
    textMessage?: string,
  ) {
    const params = new URLSearchParams({
      code: roomCode,
      subpath: '/play',
    });
    const playLink = `${process.env.MEZON_APP_DEEP_URL ?? 'www.mezon.ai'}/channel-app/${channelId}/${clanId}?${params.toString()}`;
    const qrCodeURL = await QRCode.toDataURL(playLink);

    channels.forEach(async (channel) => {
      try {
        // Check if the channel is a private channel
        // Regex to match ${room} in textMessage with the roomCode
        const message = textMessage?.replace(/\${room}/g, roomCode);
        await this.client.sendMessage(
          channel.clanId,
          channel.channelId,
          ChannelTypeMapper[channel.type],
          !channel.isPrivateChannel,
          {
            t: message ?? 'Tham gia trò chơi Đố Bạn cùng NCC',
            embed: [
              {
                title: 'Tham gia trò chơi Đố Bạn cùng NCC',
                url: playLink,
                description: `Hãy nhập mã: ${roomCode} hoặc quét mã QR bằng ứng dụng Mezon để tham gia`,
                image: {
                  url: qrCodeURL,
                },
              },
            ],
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
