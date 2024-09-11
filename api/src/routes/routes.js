import { QUEUES } from "shared";

const MESSAGE_SCHEMA = {
  type: "string",
  properties: {
    title: {
      type: "string",
      description: "Mail message title",
    },
    content: {
      type: "string",
      description: "Mail message content",
    },
    author: {
      type: "string",
      description: "Message's author",
    },
    recipient: {
      type: "string",
      description: "Message's recipient",
    },
  },
};

export default async (fastify) => {
  fastify.post("/msg", {
    schema: {
      description:
        "The route listenes for new messages from users. Handler uses amqpClient library to push messages to RabbitMQ.",
      tags: ["messages"],
      body: MESSAGE_SCHEMA,
      response: {
        200: { type: "string" },
      },
    },
    handler: async (request) => {
      console.log("requestrequest", typeof request.body);
      fastify.messagesPublisher.publish(
        QUEUES.MAIL_MESSAGES.name,
        request.body
      );

      return "Your message has been sent.";
    },
  });
};
