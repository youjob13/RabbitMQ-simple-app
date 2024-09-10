export class HttpService {
  #apiHost = "";

  constructor({ apiHost }) {
    this.#apiHost = apiHost;
  }

  async sendMessage(msg) {
    return fetch(`${this.#apiHost}/msg`, {
      method: "POST",
      body: JSON.stringify(msg),
    }).then((response) => response.json());
  }
}
