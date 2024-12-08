class Tooltip {
  constructor() {
    this.element = this.createElement(this.template());
    this.foo = document.querySelector('[data-tooltip="foo"]');
    this.bar = document.querySelector('[data-tooltip="bar-bar-bar"]');
    this.createListeners();
  }
  createElement(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  }
  template() {
    return `<div class="tooltip""></div>`;
  }
  initialize() {}

  onMouseMove(e) {
    // console.log(e.pageX, e.pageY);
    let text = e.target.dataset.tooltip;
    document.body.append(this.element);
    this.element.innerHTML = text;
    this.moveAt(e.pageX, e.pageY);
  }
  moveAt(pageX, pageY) {
    this.element.style.left = pageX + "px";
    this.element.style.top = pageY + "px";
  }
  createListeners() {
    this.foo.addEventListener("pointerover", this.onMouseMove.bind(this));
    this.foo.addEventListener("pointerout", this.remove());
    this.bar.addEventListener("pointerover", this.onMouseMove.bind(this));
    this.bar.addEventListener("pointerout",this.remove());
  }

  destroyListeners() {
    this.foo.addEventListener("pointerover", this.onMouseMove.bind(this));
    this.foo.addEventListener("pointerout", this.remove());
    this.bar.addEventListener("pointerover", this.onMouseMove.bind(this));
    this.bar.addEventListener("pointerout", this.remove());
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}

export default Tooltip;
