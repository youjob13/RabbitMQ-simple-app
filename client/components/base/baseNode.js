export class BaseNode {
  element;

  constructor(props) {
    this.element = document.createElement(props.tagName);

    if (props.classes) {
      props.classes.forEach((className) => {
        this.element.classList.add(className);
      });
    }

    if (props.text) {
      this.element.textContent = props.text;
    }

    return this.element;
  }
}
