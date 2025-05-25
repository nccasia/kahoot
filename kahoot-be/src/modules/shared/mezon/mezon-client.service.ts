import { MezonChannel } from '@modules/room/types/channel.type';
import { Injectable, Logger } from '@nestjs/common';
import { MezonClient } from 'mezon-sdk';
import * as QRCode from 'qrcode';

@Injectable()
export class MezonClientService {
  private readonly client: MezonClient;
  private logger = new Logger(MezonClientService.name);

  constructor() {
    this.client = new MezonClient(process.env.MEZON_APP_SECRET);
    this.client.login().then(() => {
      console.log('Mezon client authenticated successfully');
    });
  }

  async sendEventChannels(
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
    const playLink = `${process.env.MEZON_APP_DEEP_URL ?? 'mezon.ai'}/channel-app/${channelId}/${clanId}?${params.toString()}`;
    const qrCodeURL = await QRCode.toDataURL(playLink);

    channels.forEach(async (channel) => {
      try {
        // Regex to match ${room} in textMessage with the roomCode
        const message = textMessage?.replace(/\${room}/g, roomCode);
        const mezonChannel = await this.client.channels.fetch(
          channel.channelId,
        );
        if (mezonChannel) {
          await mezonChannel.send({
            t: message ?? 'Join the Quiz game now!',
            embed: [
              {
                title: 'Tap or click here to play the Quiz game',
                url: playLink,
                description: `Enter the pin code: ${roomCode} or scan QR code to join Quiz game on mobile devices`,
                image: {
                  url: qrCodeURL,
                },
              },
            ],
          });
        }
      } catch (error) {
        this.logger.warn(
          `Error sending message to channel: ${channel.channelName}`,
          error?.message,
        );
      }
    });
  }
}
