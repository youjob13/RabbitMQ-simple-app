import { BaseNode } from "./baseNode.js";

export class Button extends BaseNode {
  constructor({ text, callback }) {
    super({ tagName: "button", text, classes: ["button"] });

    this.addEventListener("click", callback);
  }
}
