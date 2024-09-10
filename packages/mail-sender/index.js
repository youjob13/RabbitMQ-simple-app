import nodemailer from "nodemailer";

export class MailSender {
  #transporter;

  constructor(options) {
    this.#transporter = nodemailer.createTransport(options);
  }

  async send(mailOptions) {
    return new Promise((resolve, reject) => {
      this.#transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  }
}
