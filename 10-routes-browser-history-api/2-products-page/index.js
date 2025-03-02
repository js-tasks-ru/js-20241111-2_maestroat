import SortableTable from "../../07-async-code-fetch-api-part-1/2-sortable-table-v3/index.js";
import DoubleSlider from "../../06-events-practice/3-double-slider/index.js";
import header from "./products-header.js";

const BACKEND_URL = "https://course-js.javascript.ru/";

export default class ProductsPage {
  constructor(container) {
    this.container = container;
    this.element = this.createElement(this.createTemplate());
    this.subElements = {};
    this.selectSubElements();
    this.dateSelect = false;
    this.range = {
      from: null,
      to: null,
    };
    this.status = null;
    this.filterName = null;
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
            <input type="text" data-element="filterName" class="form-control" placeholder="Название товара">
          </div>
            <!-- DoubleSlider component -->
        <div data-element="DoubleSlider" class="product-slider"></div>
          <div class="form-group">
            <label class="form-label">Статус:</label>
            <select class="form-control" data-element="filterStatus">
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

    this.DoubleSlider = new DoubleSlider({min: 0, max: 4000, selected: this.range, formatValue: value => '$' + value});
    this.subElements.DoubleSlider.append(this.DoubleSlider.element);

    if (!this.dateSelect) {
      this.subElements.sortableTable.append(this.sortableTableCreate("api/rest/products?_embed=subcategory.category").element);
    } else {
      const url = await this.updateUrl();
      this.subElements.sortableTable.append(this.sortableTableCreate(url).element);
    }
    // console.log(this.container);
    this.container.innerHTML = '';
    this.container.append(this.element);
  }
  onResetFilters = (e) => {
    const buttonPlaceholder = e.target.closest(".sortable-table__empty-placeholder");
    if (!buttonPlaceholder) {
      return;
    }
    this.range = {
      from: null,
      to: null,
    };
    this.subElements.filterStatus.value = "";
    this.subElements.filterName.value = "";
  
    this.dateSelect = false;
    this.render();
  }
  async updateUrl() {
    const url = new URL("api/rest/products?_embed=subcategory.category", BACKEND_URL);
    this.range.from && url.searchParams.set("price_gte", this.range.from);
    this.range.to && url.searchParams.set("price_lte", this.range.to);
    this.status && url.searchParams.set("status", this.status);
    this.filterName && url.searchParams.set("title_like", this.filterName);

    return url;
  }
  sortableTableCreate(url) {
    return new SortableTable(header, {
      url: url,
      isSortLocally: true,
    });
  }
  createListeners() {
    this.element.addEventListener("range-select", this.onDableSliderDateSelect);
    this.element.addEventListener("change", this.onFormSelect);
    this.element.addEventListener("input", this.onFormSelect);
    this.element.addEventListener("click", this.onResetFilters);
  }
  destroyListeners() {
    this.element.removeEventListener("range-select", this.onDableSliderDateSelect);
    this.element.removeEventListener("change", this.onFormSelect);
    this.element.removeEventListener("input", this.onFormSelect);
    this.element.removeEventListener("click", this.onResetFilters);
  }
  onDableSliderDateSelect = (e) => {
    this.selectSubElements();
    this.range = {
      from: e.detail.from,
      to: e.detail.to,
    };
    this.dateSelect = true;
    this.render();
  }
  onFormSelect = (e) => {
    e.preventDefault();
    this.selectSubElements();
    this.status = this.subElements.filterStatus.value;
    this.filterName = this.subElements.filterName.value.trim();
    this.dateSelect = true;
    this.render();
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
    this.destroyListeners();
  }

}
