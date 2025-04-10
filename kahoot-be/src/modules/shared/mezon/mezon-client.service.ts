import { Injectable } from '@nestjs/common';
import { MezonClient } from 'mezon-sdk';

@Injectable()
export class MezonClientService {
  private readonly client: MezonClient;

  constructor() {
    this.client = new MezonClient(process.env.MEZON_APP_SECRET);
    // this.client
    //   .authenticate()
    //   .then(() => {
    //     console.log('Mezon client authenticated successfully');
    //   })
    //   .catch((error) => {
    //     console.error('Error authenticating Mezon client:', error);
    //   });
  }

  async sendRoomCodeToChanneles(roomCode: string, channelIds: string[]) {
    const promises = channelIds.map(() => {});
    return Promise.all(promises);
  }
}
