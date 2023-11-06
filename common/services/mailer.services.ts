import {StreamService} from './kafka/stream.kafka';
import { mailBody } from '../types/mailBody.types';

export class MailService {
  stream: StreamService = new StreamService(process.env.MAIL_TOPIC!);

  constructor() { }

  send = async (mailBody: mailBody): Promise<void> => {
    // await this.stream.stream(mailBody);
  }
}