import SortableList from "../../09-tests-for-frontend-apps/2-sortable-list/index.js";

const BACKEND_URL = "https://course-js.javascript.ru/";
import fetchJson from "./utils/fetch-json.js";

export default class CategoriesPage {
  constructor() {
    this.sortableList = null;
    this.element = null;
    this.data = null;
    this.url = new URL(
      "/api/rest/categories?_sort=weight&_refs=subcategory",
      BACKEND_URL
    );
  }
  createElement(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  }
  template(data) {
    if (!data) {

      return `<div data-element="categoriesContainer"><div class="category category_open" data-id="bytovaya-texnika"></div></div>`;
    }
    let el = [];
    for (let elem of data) {
      el.push(this.ulElements(elem));
    }
    return `<div data-element="categoriesContainer">${el.join("")}</div>`;
  }
  ulElements(elem) {
    const sortableList = new SortableList({
      items: this.data.map(item => {
        const element = document.createElement('li');
        // element.setAttribute("data-grab-handle", "");
        // element.dataset.grabHandle = "";
        // element.dataset.id = item.id;
        element.innerHTML = `
       <strong>${item.title}</strong>
       <span><b>${item.count}</b> products</span>
        `;
  
        return element;
      })
    });
    const element = document.createElement('div');
    element.append(sortableList.element);
    // element.sortableList.createListener();
    // console.log(sortableList.element);
    // console.log(element);

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
  async render() {

    this.data = await this.loadData();
    // console.log(this.data);
    if (!this.data) {
      return;
    }

    this.element = this.createElement(this.template(this.data));
    // this.createListener();
    return this.element;
  }
  async loadData() {
    // this.element.classList.add('sortable-table_loading');
    const data = await fetchJson(this.url.toString());
    // this.element.classList.remove('sortable-table_loading');
    return data;
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
}
