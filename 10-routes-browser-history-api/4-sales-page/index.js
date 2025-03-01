import RangePicker from "../../08-forms-fetch-api-part-2/2-range-picker/index.js";
// import SortableTable from "./components/2-sortable-table-v3/index.js";
import SortableTable from "../../07-async-code-fetch-api-part-1/2-sortable-table-v3/index.js";
import header from "./sales-header.js";

const BACKEND_URL = "https://course-js.javascript.ru/";

export default class SalesPage {
  constructor() {
    this.element = this.createElement(this.createTemplate());
    this.subElements = {};
    this.selectSubElements();
    this.range = {
      from: new Date(Date.now() - 2592e6),
      to: new Date(),
    };
    this.rangePicker = null;
    this.dateSelect = false;
    this.createListeners();
    this.render();
  }
  createElement(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  }
  createTemplate() {
    return `<div class="sales">
      <div class="content__top-panel">
        <h1 class="page-title">Продажи</h1>
        <!-- RangePicker component -->
        <div data-element="rangePicker"></div>
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
    this.subElements.rangePicker.innerHTML = "";
    this.subElements.sortableTable.innerHTML = "";

    this.rangePicker = new RangePicker({from: this.range.from, to: this.range.to});
    this.subElements.rangePicker.append(this.rangePicker.element);

    if (!this.dateSelect) {
      this.subElements.sortableTable.append(this.sortableTableCreate(`/api/rest/orders?createdAt_gte=${this.range.from.toISOString()}&createdAt_lte=${this.range.to.toISOString()}`).element);
    } else {
      const url = await this.updateUrl();
      this.subElements.sortableTable.append(this.sortableTableCreate(url).element);
    }

    return this.element;
  }
  resetFilters = (e) => {
    const buttonPlaceholder = e.target.closest(".sortable-table__empty-placeholder");
    if (!buttonPlaceholder) {
      return;
    }
    this.range = {
      from: new Date(Date.now() - 2592e6),
      to: new Date(),
    };
  
    this.dateSelect = false;
    this.render();
  }
  async updateUrl() {
    const url = new URL(`/api/rest/orders`, BACKEND_URL);
    url.searchParams.append("createdAt_gte", this.range.from.toISOString());
    url.searchParams.append("createdAt_lt", this.range.to.toISOString());

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
    this.element.addEventListener("click", this.resetFilters);
  }
  destroyListeners() {
    this.element.removeEventListener(
      "date-select",
      this.onRangePickerDateSelect
    );
    this.element.removeEventListener("click", this.resetFilters);
  }
  onRangePickerDateSelect = (e) => {
    this.range = e.detail;
    this.dateSelect = true;
    this.render();
  };
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }

}
