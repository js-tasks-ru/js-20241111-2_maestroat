class Tooltip {
  static instance;
  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
    this.element = this.createElement(this.template());
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerOver = this.handlePointerOver.bind(this);
    this.handlePointerOut = this.handlePointerOut.bind(this);
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
    document.addEventListener("pointermove", this.handlePointerMove);
    document.addEventListener("pointerover", this.handlePointerOver);
    document.addEventListener("pointerout", this.handlePointerOut);
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
