import SortableTable from "../../07-async-code-fetch-api-part-1/2-sortable-table-v3/index.js";
import DoubleSlider from "../../06-events-practice/3-double-slider/index.js";
import header from "./bestsellers-header.js";

import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru/";

export default class ProductsPage {
  constructor() {
    this.element = this.createElement(this.createTemplate());
    this.subElements = {};
    this.selectSubElements();
    this.dateSelect = false;
    this.createListeners();
  }
  createElement(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  }
  createTemplate() {
    return `<div class="products">
            <div class="content__top-panel">
        <h1 class="page-title">Товары</h1>
        <a href="/products/add" class="button-primary">Добавить товар</a>
      </div>
      <div class="content-box content-box_small">
        <form class="form-inline">
          <div class="form-group">
            <label class="form-label">Сортировать по:</label>
            <input type="text" data-elem="filterName" class="form-control" placeholder="Название товара">
          </div>
                  <!-- DoubleSlider component -->
        <div data-element="DoubleSlider"></div>
          <div class="form-group">
            <label class="form-label">Статус:</label>
            <select class="form-control" data-elem="filterStatus">
              <option value="" selected="">Любой</option>
              <option value="1">Активный</option>
              <option value="0">Неактивный</option>
            </select>
          </div>
        </form>
      </div>

      <div data-element="sortableTable">
        <!-- sortable-table component -->
      </div>
    </div>`;
  }
  selectSubElements() {
    this.element.querySelectorAll("[data-element]").forEach((element) => {
      this.subElements[element.dataset.element] = element;
    });
  }
  async render() {
    this.subElements.DoubleSlider.innerHTML = "";
    this.subElements.sortableTable.innerHTML = "";

    this.DoubleSlider = new DoubleSlider();
    this.subElements.DoubleSlider.append(this.DoubleSlider.element);

    console.log(this.subElements);

    if (!this.dateSelect) {
      this.subElements.sortableTable.append(this.sortableTableCreate("api/rest/products").element);
    } else {

      const url = await this.updateUrl();
      this.subElements.sortableTable.append(this.sortableTableCreate(url).element);
    }

    return this.element;
  }
  async updateUrl() {
    const url = new URL("api/rest/products", BACKEND_URL);
    url.searchParams.append("from", this.range.from.toISOString());
    url.searchParams.append("to", this.range.to.toISOString());

    return url;
  }
  sortableTableCreate(url) {
    return new SortableTable(header, {
      url: url,
      isSortLocally: true,
    });
  }
  createListeners() {
    this.element.addEventListener("date-select", this.onRangePickerDateSelect);
  }
  destroyListeners() {
    this.element.removeEventListener(
      "date-select",
      this.onRangePickerDateSelect
    );
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }

}
