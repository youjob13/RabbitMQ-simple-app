import cors from "@fastify/cors";
import autoLoad from "@fastify/autoload";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function setupPlugins(fastify) {
  await fastify.register(import("@fastify/sensible"));

  await fastify.register(cors, {
    origin: "*",
  });

  await fastify.register(import("@fastify/swagger"), {
    openapi: {
      openapi: "3.0.0",
      components: {
        securitySchemes: {
          apiKey: {
            type: "apiKey",
            name: "apiKey",
            in: "header",
          },
        },
      },
    },
  });

  await fastify.register(import("@fastify/swagger-ui"), {
    routePrefix: "/documentation",
  });

  await fastify.register(autoLoad, {
    dir: join(__dirname, "services"),
    forceESM: true,
  });

  await fastify.register(autoLoad, {
    dir: join(__dirname, "routes"),
    options: { prefix: "/" },
    forceESM: true,
  });

  await fastify.ready(() => {
    fastify.log.info(fastify.printRoutes());
  });
}
