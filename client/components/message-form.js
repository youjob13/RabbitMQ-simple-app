import { Textarea } from "./base/textarea.js";
import { Button } from "./base/button.js";
import { Wrapper } from "./base/wrapper.js";
import { Label } from "./base/label.js";

export class MessageForm {
  constructor(httpService) {
    const formBlocks = this.getFormBlocks([
      { id: "title", label: "Title" },
      { id: "content", label: "Content" },
      { id: "author", label: "Author-Email" },
      { id: "recipient", label: "Recipient-Email" },
    ]);

    const button = new Button({
      text: "Send",
      callback: () => {
        const formData = extractFormData(formBlocks.formData);
        httpService.sendMessage(formData);
      },
    });

    return new Wrapper({
      elements: [...formBlocks.elemsToDraw, button],
      classes: ["wrapper", "main-wrapper"],
    });
  }

  getFormBlocks(blocks) {
    return blocks.reduce(
      (acc, { id, label }) => {
        const { block, input } = this.drawFormBlock({ label });
        acc.elemsToDraw.push(block);
        acc.formData[id] = input;
        return acc;
      },
      {
        elemsToDraw: [],
        formData: {},
      }
    );
  }

  drawFormBlock({ label }) {
    const labelText = new Label({ text: label });
    const input = new Textarea({ classes: ["input", `${label}-input`] });

    const block = new Wrapper({
      elements: [labelText, input],
      classes: ["wrapper", `${label}-wrapper`],
    });

    return { block, labelText, input };
  }
}

function extractFormData(formData) {
  return Object.entries(formData).reduce((acc, [id, input]) => {
    acc[id] = input.value;
    input.value = "";

    return acc;
  }, {});
}
