import { Kafka, KafkaConfig } from 'kafkajs';

export class KafkaJSClass {
    // private kafkaConfig: KafkaConfig = { clientId: 'sample-consumer', brokers: ['localhost:9092'] }
    // protected readonly kafka: Kafka = new Kafka(this.kafkaConfig);
    private kafkaConfig: KafkaConfig = { clientId: process.env.CLIENTID, brokers: [`${process.env.BROKER_URL}:${process.env.BROKER_PORT}`] }
    protected readonly kafka: Kafka = new Kafka(this.kafkaConfig);
}