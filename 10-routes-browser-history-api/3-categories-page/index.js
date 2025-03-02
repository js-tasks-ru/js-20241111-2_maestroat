import SortableList from "../../09-tests-for-frontend-apps/2-sortable-list/index.js";

const BACKEND_URL = "https://course-js.javascript.ru/";
import fetchJson from "./utils/fetch-json.js";

export default class CategoriesPage extends SortableList {
  constructor() {
    super({items: []});
    this.element = null;
    this.data = null;
    this.url = new URL(
      "/api/rest/categories?_sort=weight&_refs=subcategory",
      BACKEND_URL
    );
    this.subElements = {};
    this.listElem = null;
  }
  createListener() {
    if (!this.data) {
      return;
    }
    for (let elem in this.subElements) {this.subElements[elem].addEventListener("pointerdown", this.onElementMove);}
    const categoriesContainer = this.element.querySelectorAll(".category");
    for (let elem of categoriesContainer) {elem.addEventListener("click", e => e.target.classList.contains("category__header") && this.onHeaderClick(elem));}
  }
  destroyListener() {
    for (let elem in this.subElements) {this.subElements[elem].removeEventListener("pointerdown", this.onElementMove);}
  }
  onHeaderClick(elem) {
    elem.classList.toggle("category_open");
  }
  onElementMove = (event) => {
    const el = event.target.closest(".sortable-list__item");
    const ul = event.target.closest(".sortable-list");
    this.listElem = ul.dataset.list;

    if (el && event.target.closest("[data-grab-handle]")) {
      event.preventDefault();
      this.dragStart(el, event);
    }

  };
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
    this.subElements[this.listElem].append(el);
    this.draggingElem = el;
    this.moveDraggingAt(t, i);
    this.element.addEventListener("pointermove", this.onDocumentPointerMove);
    this.element.addEventListener("pointerup", this.onDocumentPointerUp);
  }
  onDocumentPointerMove = (e) => {
    this.moveDraggingAt(e.clientX, e.clientY);
    if (e.clientY < this.subElements[this.listElem].firstElementChild.getBoundingClientRect().top)
      this.movePlaceholderAt(0);
    else if (e.clientY > this.subElements[this.listElem].lastElementChild.getBoundingClientRect().bottom)
      this.movePlaceholderAt(this.subElements[this.listElem].children.length);
    else
      for (let t = 0; t < this.subElements[this.listElem].children.length; t++) {
        let i = this.subElements[this.listElem].children[t];
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
    this.subElements[this.listElem].children[e] !== this.placeholderElem &&
      this.subElements[this.listElem].insertBefore(this.placeholderElem, this.subElements[this.listElem].children[e]);
  };
  selectSubElements() {
    this.element.querySelectorAll("[data-list]").forEach((element) => {
      this.subElements[element.dataset.list] = element;
    });
  }
  createElement(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  }
  template() {
    if (!this.data) {
      return;
    }
    let el = [];
    for (let elem of this.data) {
      el.push(this.ulElements(elem));
    }
    return `<div class="categories">
            <div class="content__top-panel">
              <h1 class="page-title">Категории товаров</h1>
            </div>
            <p>Подкатегории можно перетаскивать, меняя их порядок внутри своей категории.</p>
            <div data-element="categoriesContainer">${el.join("")}</div>
            </div>`;
  }
  ulElements(elem) {
    const sortableList = new SortableList({
      items: this.data.map(item => {
        const element = document.createElement('li');
        element.dataset.grabHandle = true;
        element.dataset.id = item.id;
        element.innerHTML = `
       <strong>${item.title}</strong>
       <span><b>${item.count}</b> products</span>
        `;
        return element;
      }), elem
    });
    const element = document.createElement('div');
    element.append(sortableList.element);

    return `<div class="category category_open" data-id="${elem.id}"><header class="category__header">
        ${elem.title}
        </header>
        <div class="category__body">
          <div class="subcategory-list">
          ${element.innerHTML}
          </div>
          </div>
        </div>`;
  }
  async render(container) {
    this.data = await this.loadData();

    if (!this.data) {
      return;
    }

    this.element = this.createElement(this.template());
    this.selectSubElements();
    this.createListener();
    container.innerHTML = '';
    container.append(this.element);
  }
  async loadData() {
    const data = await fetchJson(this.url.toString());
    return data;
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
}
