import { MessageForm } from "./components/message-form.js";
import { HttpService } from "./http.service.js";

class App {
  #entryPoint;
  #httpService;
  #options;

  constructor(options) {
    this.#options = options;
    this.#entryPoint = options?.entryPoint;

    if (this.#entryPoint == null) {
      throw new Error("Entry point is not defined. Exit with error :(");
    }
  }

  run() {
    this.#initServices();
    this.#draw();
  }

  #initServices() {
    this.#httpService = new HttpService({ apiHost: this.#options.apiHost });
  }

  #draw() {
    this.#clear();
    this.#insert(new MessageForm(this.#httpService));
  }

  #clear() {
    document.body.innerHTML = "";
  }

  #insert(element) {
    switch (true) {
      case Array.isArray(element): {
        element.forEach((item) => document.body.append(item));
        break;
      }
      default:
        document.body.append(element);
    }
  }
}

const entryPoint = document.getElementById("entryPoint");

const app = new App({ entryPoint, apiHost: "http://localhost:3000" });
app.run();
