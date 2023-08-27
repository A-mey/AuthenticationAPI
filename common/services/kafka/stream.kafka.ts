import { KafkaProducer } from "./producer.kafka";

export class StreamService extends KafkaProducer {

    constructor(topic : string) {
      super(topic);
    }
  
    async stream(message: unknown): Promise<void> {
      message = JSON.stringify(message)
      await super.connect();
      await super.send(message);
      await super.disconnect();
    }
  }