import RangePicker from "./components/range-picker/src/index.js";
import SortableTable from "./components/sortable-table/src/index.js";
import ColumnChart from "./components/column-chart/src/index.js";
import header from "./bestsellers-header.js";

import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru/";

export default class Page {
  constructor() {
    this.rangePicker = null;
    this.sortableTable = null;
    this.columnChart = null;
    this.element = this.createElement(this.createTemplate());
    this.subElements = {};
    this.selectSubElements();
    this.range = {
      from: new Date(),
      to: new Date(),
    };
    this.createListeners();
    this.url = "";
  }
  createElement(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  }
  createTemplate() {
    return `<div class="dashboard">
      <div class="content__top-panel">
        <h2 class="page-title">Dashboard</h2>
        <!-- RangePicker component -->
        <div data-element="rangePicker"></div>
      </div>
      <div data-element="chartsRoot" class="dashboard__charts">
        <!-- column-chart components -->
        <div data-element="ordersChart" class="dashboard__chart_orders"></div>
        <div data-element="salesChart" class="dashboard__chart_sales"></div>
        <div data-element="customersChart" class="dashboard__chart_customers"></div>
      </div>

      <h3 class="block-title">Best sellers</h3>

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
    this.subElements.ordersChart.innerHTML = "";
    this.subElements.salesChart.innerHTML = "";
    this.subElements.customersChart.innerHTML = "";
    this.subElements.sortableTable.innerHTML = "";

    this.rangePicker = new RangePicker();
    this.subElements.rangePicker.append(this.rangePicker.element);

    this.url = "api/dashboard/orders";
    this.columnChart = new ColumnChart({
      url: this.url,
      range: this.range,
      link: "#",
      label: "orders",
      formatHeading: (data) => data.toLocaleString(),
    });
    this.subElements.ordersChart.append(this.columnChart.element);

    this.url = "api/dashboard/sales";
    this.columnChart = new ColumnChart({
      url: this.url,
      range: this.range,
      label: "sales",
      formatHeading: (data) => data.toLocaleString(),
    });
    this.subElements.salesChart.append(this.columnChart.element);

    this.url = "api/dashboard/customers";
    this.columnChart = new ColumnChart({
      url: this.url,
      range: this.range,
      label: "customers",
      formatHeading: (data) => data.toLocaleString(),
    });
    this.subElements.customersChart.append(this.columnChart.element);

    this.url = "api/dashboard/bestsellers";
    this.sortableTable = new SortableTable(header, {
      url: this.url,
      isSortLocally: true,
    });
    this.subElements.sortableTable.append(this.sortableTable.element);

    return this.element;
  }
  createListeners() {
    this.element.addEventListener("date-select", this.thisDetails);
  }
  destroyListeners() {
    this.element.removeEventListener("date-select", this.thisDetails);
  }
  thisDetails = (e) => {
    this.range = e.detail;
    this.render();
  };
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
}
