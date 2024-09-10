import amqplib from "amqplib";
import EventEmitter from "events";

export class AMQPClient extends EventEmitter {
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

    const promises = queues.map(async (queue) => {
      if (this.channelsByQueueNameMap.has(queue)) {
        throw new Error(`Queue with ${queue} name already exists!`);
      }

      const channel = await this.connection.createChannel();
      await channel.assertQueue(queue);

      this.channelsByQueueNameMap.set(queue, channel);
    });

    Promise.all(promises);
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
