import { AMQPClient } from "amqp-client";
import { QUEUES } from "shared";

export class MessagesPublisher {
  static AMQP_HOST = process.env.AMQP_HOST;
  #amqpClient;

  constructor() {
    this.#amqpClient = new AMQPClient({ host: MessagesPublisher.AMQP_HOST });
    this.#amqpClient.initQueues(QUEUES.ALL);
  }

  publish(queue, body) {
    this.#amqpClient.publish(queue, body);
  }
}
