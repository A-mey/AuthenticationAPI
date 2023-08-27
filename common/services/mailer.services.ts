import {StreamService} from './kafka/stream.kafka'

export class MailService {
  stream: StreamService = new StreamService(process.env.MAIL_TOPIC!);

  constructor() { }

  async send(mailBody: mailBody): Promise<void> {
    await this.stream.stream(mailBody);
  }
}