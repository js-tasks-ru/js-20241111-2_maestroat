export default class SortableList {
  constructor(items) {
    this.items = items;
    this.element = this.createElement(this.template());
    this.draggingElem = null;
    this.placeholderElem = null;
    this.elementInitialIndex = null;
    this.pointerInitialShift = null;
    this.createListener();
  }
  createElement(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  }
  template() {
    return `<ul class="sortable-list">${this.liElements()}</ul>`;
  }
  liElements() {
    return this.items.items
      .map(
        (item) =>
          `<li class="sortable-list__item">${item.innerHTML}</li>`
      )
      .join("");
  }
  createListener() {
    this.element.addEventListener("pointerdown", this.onElementMove);
  }
  onElementMove = (event) => {
    let el = event.target.closest(".sortable-list__item");
    if (el && event.target.closest("[data-grab-handle]")) {
      event.preventDefault();
      this.dragStart(el, event);
    }
    if (event.target.closest("[data-delete-handle]")) {
      event.preventDefault();
      this.removeItem(el);
    }
  };
  removeItem(e) {
    e.remove();
  }
  dragStart(el, { clientX: t, clientY: i }) {
    this.pointerInitialShift = {
      x: t - el.getBoundingClientRect().x,
      y: i - el.getBoundingClientRect().y,
    };
    this.placeholderElem = document.createElement("div");
    this.placeholderElem.className = "sortable-list__placeholder";
    el.style.width = el.offsetWidth + "px";
    el.style.height = el.offsetHeight + "px";
    this.placeholderElem.style.width = el.style.width;
    this.placeholderElem.style.height = el.style.height;
    el.classList.add("sortable-list__item_dragging");
    el.after(this.placeholderElem);
    this.element.append(el);
    this.draggingElem = el;
    this.moveDraggingAt(t, i);
    document.addEventListener("pointermove", this.onDocumentPointerMove);
    document.addEventListener("pointerup", this.onDocumentPointerUp);
  }
  moveDraggingAt(e, t) {
    this.draggingElem.style.left = e - this.pointerInitialShift.x + "px";
    this.draggingElem.style.top = t - this.pointerInitialShift.y + "px";
  }
  onDocumentPointerMove = (e) => {
    this.moveDraggingAt(e.clientX, e.clientY);
    if (e.clientY < this.element.firstElementChild.getBoundingClientRect().top)
      this.movePlaceholderAt(0);
    else if (e.clientY > this.element.lastElementChild.getBoundingClientRect().bottom)
      this.movePlaceholderAt(this.element.children.length);
    else
      for (let t = 0; t < this.element.children.length; t++) {
        let i = this.element.children[t];
        if (i !== this.draggingElem && (e.clientY > i.getBoundingClientRect().top && e.clientY < i.getBoundingClientRect().bottom)) {
          if (e.clientY < i.getBoundingClientRect().top + i.offsetHeight / 2) {
            this.movePlaceholderAt(t);
            break
          }
          this.movePlaceholderAt(t + 1);
          break
        }
      }
  };
  movePlaceholderAt = (e) => {
    this.element.children[e] !== this.placeholderElem &&
      this.element.insertBefore(this.placeholderElem, this.element.children[e]);
  };
  onDocumentPointerUp = () => {
    this.dragStop();
  };
  dragStop() {
    this.placeholderElem.replaceWith(this.draggingElem);
    this.draggingElem.classList.remove("sortable-list__item_dragging");
    this.draggingElem.style.left = "";
    this.draggingElem.style.top = "";
    this.draggingElem.style.width = "";
    this.draggingElem.style.height = "";
    document.removeEventListener("pointermove", this.onDocumentPointerMove);
    document.removeEventListener("pointerup", this.onDocumentPointerUp);
    this.draggingElem = null;
  }
  remove() {
    this.element.remove();
    document.removeEventListener("pointerdown", this.onElementMove);
  }
  destroy() {
    this.remove();
  }
}
