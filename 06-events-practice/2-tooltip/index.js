class Tooltip {
  static instance;
  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
    this.element = this.createElement(this.template());
  }
  createElement(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  }
  template() {
    return `<div class="tooltip"></div>`;
  }
  initialize() {
    document.addEventListener("pointermove", (e) => this.handlePointerMove(e));
    document.addEventListener("pointerover", (e) => this.handlePointerOver(e));
    document.addEventListener("pointerout", (e) => this.handlePointerOut(e));
  }

  handlePointerOver(e) {
    let text = e.target.getAttribute("data-tooltip");
    if (text === null) {
      return;
    }
    this.render(text);
  }
  handlePointerOut() {
    if (this.element === null) {
      return;
    }
    this.remove();
  }
  handlePointerMove(e) {
    if (this.element === null) {
      return;
    }
    let text = e.target.getAttribute("data-tooltip");
    if (text === null) {
      return;
    }
    this.element.style.left = e.pageX + "px";
    this.element.style.top = e.pageY + "px";
  }
  destroyListeners() {
    document.removeEventListener("pointermove", this.handlePointerMove);
    document.removeEventListener("pointerover", this.handlePointerOver);
    document.removeEventListener("pointerout", this.handlePointerOut);
  }
  render(text) {
    document.body.append(this.element);
    this.element.innerHTML = text;
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.destroyListeners();
  }
}

export default Tooltip;
