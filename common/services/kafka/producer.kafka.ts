import { catchError } from '../../helpers/catch.helper';
import { KafkaJSClass } from './config.kakfa';

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
        catch(e: unknown) {
            console.log(await catchError(e));
        }
    }

    async send(message: unknown) {
        const data = message as string;
        await this.producer.send({
            topic: this.topic,
            messages: [
              { value: data },
            ],
          })
    }

    async disconnect() {
        await this.producer.disconnect();
    }
}