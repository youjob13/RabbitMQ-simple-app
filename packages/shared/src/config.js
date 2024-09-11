const MAIL_MESSAGES_QUEUE = {
  name: "mail-messages",
  routingKey: "mailMessages",
};

export const QUEUES = {
  MAIL_MESSAGES: MAIL_MESSAGES_QUEUE,
  ALL: [MAIL_MESSAGES_QUEUE],
};
