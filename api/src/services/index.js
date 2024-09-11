import fp from "fastify-plugin";
import { MessagesPublisher } from "./messagesPublisher.js";

export default fp(async (fastify) => {
  const messagesPublisher = new MessagesPublisher();
  fastify.decorate("messagesPublisher", messagesPublisher);
});
