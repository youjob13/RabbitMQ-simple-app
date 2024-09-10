import { BaseNode } from "./baseNode.js";

export class Wrapper extends BaseNode {
  constructor({ elements, classes }) {
    super({ tagName: "div", classes });

    elements.forEach((element) => {
      this.append(element);
    });
  }
}
