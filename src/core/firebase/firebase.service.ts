import { Injectable } from '@nestjs/common';
import { getMessaging, MulticastMessage } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseService {
  constructor() {}

  async sendNotification(message: MulticastMessage) {
    try {
      await getMessaging().sendMulticast(message);
      return true;
    } catch (error) {
      console.log(error);
    }

    return null;
  }
}
