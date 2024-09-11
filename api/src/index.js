import Fastify from "fastify";
import setupPlugins from "./setup.js";

const fastify = Fastify({
  logger: true,
});

class App {
  #appPort;

  constructor({ appPort }) {
    this.#appPort = appPort;
  }

  async run() {
    await setupPlugins(fastify);

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
});
app.run();
