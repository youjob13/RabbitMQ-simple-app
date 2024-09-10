import { BaseNode } from "./baseNode.js";

export class Textarea extends BaseNode {
  constructor({ classes }) {
    super({ tagName: "textarea", classes });
  }
}
