import { fastify } from "./setup-fastify.js";
import { QUEUES } from "shared";

export default ({ amqpClient }) => {
  fastify.post("/msg", {
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            content: {
              type: "string",
            },
            author: {
              type: "string",
            },
            recipient: {
              type: "string",
            },
          },
        },
      },
    },
    handler: async (request) => {
      amqpClient.publish(QUEUES.MAIL_MESSAGES.name, request.body);
      return "Your message has been sent.";
    },
  });
};
