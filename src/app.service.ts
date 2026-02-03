import { Injectable } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async checkConnection(): Promise<string> {
    // Por probar : 0 = disconnected / 1 = connected / 2 = connecting
    const status = this.connection.readyState;

    switch (status) {
      case 0:
        return 'Disconnected';
      case 1:
        return 'Connected';
      case 2:
        return 'Connecting';
      case 3:
        return 'Disconnecting';
      default:
        return 'Unknown';
    }
  }
}
