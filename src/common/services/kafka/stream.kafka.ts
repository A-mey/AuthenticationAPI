import { KafkaProducer } from "./producer.kafka";

export class StreamService extends KafkaProducer {

    constructor(topic : string) {
      super(topic);
    }
  
    stream = async (message: unknown): Promise<void> => {
      message = JSON.stringify(message)
      await this.connect();
      await this.send(message);
      await this.disconnect();
    }
  }