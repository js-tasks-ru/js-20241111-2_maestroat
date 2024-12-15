export default class DoubleSlider {
  minValue = 100;

  constructor({
    min = 100,
    max = 200,
    formatValue = (value) => "$" + value,
    selected = {},
  } = {}) {
    this.min = min;
    this.max = max;
    this.from = selected.from ?? min;
    this.to = selected.to ?? max;
    this.formatValue = formatValue;
    this.subElements = {};
    this.element = this.createElement(this.template());
    this.selectSubElements();
    this.activeThumb = null;
    this.createListeners();
  }

  createElement(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  }

  template() {
    const leftProgress = this.toLeftPercent(this.from, this.max, this.min);
    const rightProgress = this.toRightPercent(this.to, this.max, this.min);
    return `<div class="range-slider">
    <span data-element="from">${this.formatValue(this.from)}</span>
    <div data-element="conteiner" class="range-slider__inner">
      <span data-element="progress" class="range-slider__progress" style="left: ${leftProgress}%; right: ${rightProgress}%"></span>
      <span data-element="thumbLeft" class="range-slider__thumb-left" style="left: ${leftProgress}%"></span>
      <span data-element="thumbRight" class="range-slider__thumb-right" style="right: ${rightProgress}%"></span>
    </div>
    <span data-element="to">${this.formatValue(this.to)}</span>
  </div>`;
  }
  selectSubElements() {
    this.element.querySelectorAll("[data-element]").forEach((element) => {
      this.subElements[element.dataset.element] = element;
    });
  }
  toLeftPercent(value, max, min) {
    const total = max - min;
    return Math.round(((value - min) / total) * 100);
  }
  toRightPercent(value, max, min) {
    const total = max - min;
    return Math.round(((max - value) / total) * 100);
  }
  createListeners() {
    this.subElements.thumbLeft.addEventListener(
      "pointerdown",
      this.handleThumPointerdown
    );
    this.subElements.thumbRight.addEventListener(
      "pointerdown",
      this.handleThumPointerdown
    );
  }
  
  handleThumPointerdown = (event) => {
    this.activeThumb = event.target.dataset.element;
    document.addEventListener("pointermove", this.handleThumbPointerdownMove);
    document.addEventListener("pointerup", this.handleThumbPointerup);

  };

  handleThumbPointerdownMove = (event) => {
    if (this.activeThumb === "thumbLeft") {
      this.from = Math.min(this.to, this.processPointerMove(event));
      this.subElements.thumbLeft.style.left = `${this.toLeftPercent(
        this.from,
        this.max,
        this.min
      )}%`;

      this.subElements.from.textContent = this.formatValue(this.from);
      this.subElements.progress.style.left = `${this.toLeftPercent(
        this.from,
        this.max,
        this.min
      )}%`;
    }
    if (this.activeThumb === "thumbRight") {
      this.to = Math.max(this.from, this.processPointerMove(event));
      this.subElements.thumbRight.style.right = `${this.toRightPercent(
        this.to,
        this.max,
        this.min
      )}%`;

      this.subElements.to.textContent = this.formatValue(this.to);
      this.subElements.progress.style.right = `${this.toRightPercent(
        this.to,
        this.max,
        this.min
      )}%`;
    }
  };
  processPointerMove(event) {
    const { left, right } = this.subElements.conteiner.getBoundingClientRect();
    const conteinerLeft = left;
    const conteinerRight = right;
    const pointerX = event.clientX;
    const normalizedPointerX = Math.min(
      Math.max(pointerX, conteinerLeft),
      conteinerRight
    );
    const percentPointerX = Math.round(
      ((normalizedPointerX - conteinerLeft) /
        (conteinerRight - conteinerLeft)) *
        100
    );
    const value = this.min + ((this.max - this.min) * percentPointerX) / 100;

    return value;
  }

  handleThumbPointerup = () => {
    document.removeEventListener(
      "pointermove",
      this.handleThumbPointerdownMove
    );
    document.removeEventListener("pointerup", this.handleThumbPointerup);
    this.dispatchCustomEvent();
  };

  dispatchCustomEvent = (event) => {
    let customEvent = new CustomEvent("range-select", {
      detail: {
        from: this.from,
        to: this.to,
      },
      bubbles: true,
    });
    this.element.dispatchEvent(customEvent);
  }
  destroyListeners() {
    this.subElements.thumbLeft.removeEventListener(
      "pointerdown",
      this.handleThumPointerdown
    );
    this.subElements.thumbRight.removeEventListener(
      "pointerdown",
      this.handleThumPointerdown
    );
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
    this.destroyListeners();
  }
}
