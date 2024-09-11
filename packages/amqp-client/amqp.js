import amqplib from "amqplib";
import EventEmitter from "events";

export class AMQPClient extends EventEmitter {
  static DLQ_EXCHANGE = "dlx.exchange";

  connection;
  channelsByQueueNameMap = new Map();
  #host;

  constructor({ host }) {
    super();
    this.#host = host;
  }

  async connect() {
    try {
      this.connection = await amqplib.connect(this.#host);
    } catch (error) {
      console.error("Failed to connect to rabbitMQ");
      throw error;
    }
  }

  async initQueues(queues) {
    await this.connect();

    const channel = await this.connection.createChannel();
    await channel.assertExchange(AMQPClient.DLQ_EXCHANGE, "direct", {
      durable: true,
    });

    const promises = queues.map(async ({ name, routingKey }) => {
      if (this.channelsByQueueNameMap.has(name)) {
        throw new Error(`Queue with ${name} name already exists!`);
      }

      const { deadLetterExchange, primaryRoutingKey } =
        await this.#bindDlqQueue({ channel, queue: name, routingKey });
      await channel.assertQueue(name, {
        durable: true,
        deadLetterExchange: deadLetterExchange,
        deadLetterRoutingKey: primaryRoutingKey,
      });

      this.channelsByQueueNameMap.set(name, channel);
    });

    Promise.all(promises);
  }

  async #bindDlqQueue({ channel, queue, routingKey }) {
    const dlqQueue = `dlq-${queue}`;

    await channel.assertQueue(dlqQueue);
    await channel.bindQueue(dlqQueue, AMQPClient.DLQ_EXCHANGE, routingKey);

    return {
      deadLetterExchange: AMQPClient.DLQ_EXCHANGE,
      primaryRoutingKey: routingKey,
    };
  }

  async consume(queue) {
    try {
      const channel = await this.connection.createChannel();
      console.log("Listening on queue", queue);

      await channel?.consume(queue, (msg) => {
        if (msg !== null) {
          const result = JSON.parse(msg.content.toString());
          console.log("Received:", result);

          channel.ack(msg);
          this.emit("message", result);
        } else {
          channel.reject(msg, false);
          this.emit("error", new Error("Consumer cancelled by server"));
        }
      });
    } catch (error) {
      this.emit("error", error);
    }
  }

  async publish(queue, data) {
    const channel = await this.connection.createChannel();
    channel.sendToQueue(queue, Buffer.from(data));
  }
}
