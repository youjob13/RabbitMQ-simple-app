import { BaseNode } from "./baseNode.js";

export class Label extends BaseNode {
  constructor({ text }) {
    super({ tagName: "label", text });
  }
}
