import { KafkaJSClass } from './kakfa.config';

export class KafkaProducer extends KafkaJSClass {
    public readonly producer = this.kafka.producer();
    topic: string

    constructor(topic: string) {
        super();
        this.topic = topic;
    }

    async connect() {
        try{
            await this.producer.connect();
            console.log("producer connected")
        }
        catch(e) {
            console.log(e);
        }
    }

    async send(message: string) {
        await this.producer.send({
            topic: this.topic,
            messages: [
              { value: message },
            ],
          })
    }

    async disconnect() {
        await this.producer.disconnect();
    }
}