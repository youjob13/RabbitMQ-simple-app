import { AMQPClient } from "amqp-client";
import { MailSender } from "mail-sender";
import { QUEUES } from "shared";

export class MessagesConsumer {
  #options;

  constructor(options) {
    this.#options = options;
  }

  async run() {
    const amqpClient = new AMQPClient({ host: this.#options.amqpHost });
    await amqpClient.connect();

    const mailSender = new MailSender({
      service: "gmail",
      auth: {
        user: this.#options.gmailUser,
        pass: this.#options.gmailPass,
      },
    });

    this.#consume({ amqpClient, mailSender, queue: QUEUES.MAIL_MESSAGES.name });
  }

  #consume({ amqpClient, mailSender, queue }) {
    amqpClient.on("message", (msg) => {
      mailSender.send({
        from: msg.author,
        to: msg.recipient,
        subject: msg.title,
        text: msg.content,
        html: `<b>${msg.content}!</b>`,
      });
    });

    amqpClient.on("error", (error) => {
      console.error("Error:", error);
      // throw error;
    });

    amqpClient.consume(queue);
  }
}

const messagesConsumer = new MessagesConsumer({
  amqpHost: process.env.AMQP_HOST,
  gmailUser: process.env.GMAIL_USER || "",
  gmailPass: process.env.GMAIL_PASS || "",
});
messagesConsumer.run();
