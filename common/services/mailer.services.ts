import {KafkaProducer} from './kafka/kafka.producer'

export class MailService extends KafkaProducer {

  constructor() {
    super(process.env.MAIL_TOPIC!);
  }

  async send(mailBody: any): Promise<void> {
    await super.connect();
    await super.send(JSON.stringify(mailBody));
    await super.disconnect();
  }

}