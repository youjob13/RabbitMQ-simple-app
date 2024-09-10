import { AMQPClient } from "amqp-client";
import { QUEUES } from "shared";

import { fastify } from "./setup-fastify.js";
import initRoutes from "./routes.js";

class App {
  #appPort;

  constructor({ amqpHost, appPort }) {
    this.#appPort = appPort;

    const amqpClient = new AMQPClient({ host: amqpHost });
    amqpClient.initQueues(QUEUES.ALL);

    initRoutes({ amqpClient });
  }

  async run() {
    try {
      await fastify.listen({ port: this.#appPort });
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  }
}

const app = new App({
  appPort: process.env.PORT || 3000,
  amqpHost: process.env.AMQP_HOST,
});
app.run();
