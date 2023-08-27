import {KafkaProducer} from './kafka/kafka.producer'

export class MailService extends KafkaProducer {

  constructor() {
    super(process.env.MAIL_TOPIC!);
  }

  async send(mailBody: mailBody): Promise<void> {
    const message = JSON.stringify(mailBody)
    await super.connect();
    await super.send(message);
    await super.disconnect();
  }

}