import fetchJson from "./utils/fetch-json.js";
import SortableTableV2 from "../../04-oop-basic-intro-to-dom/1-column-chart/index.js";
const BACKEND_URL = "https://course-js.javascript.ru";
export default class ColumnChart extends SortableTableV2 {
  constructor({
    parameters = {},
    url = "",
    range = {},
    label = "",
    link = "",
    formatHeading = (data) => data,
  }) {
    super(parameters);
    const { data = [], value = 0 } = parameters;
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.url = url;
    this.from = range.from ?? null;
    this.to = range.to ?? null;
    this.formatHeading = formatHeading;
    this.createLink = super.createLink();
    this.subElements = {};
    this.selectSubElements();
    this.fetchData();
  }
  selectSubElements() {
    this.element.querySelectorAll("[data-element]").forEach((element) => {
      this.subElements[element.dataset.element] = element;
    });
  }
  async fetchData() {
    try {
      const response = await fetch(this.createUrl());
      const ordersData = await response.json();
      // console.log(this.data);
      this.data = Object.values(ordersData);
      this.subElements.body.innerHTML = this.createBodyChart();
      let sum = this.data.reduce((sum, el) => sum + el, 0);
      this.subElements.header.textContent = this.formatHeading(sum);
      this.element.classList.remove("column-chart_loading");
      let str = this.label + this.createLink;
      this.element.firstElementChild.innerHTML = str.trim();
    } catch (err) {
      const url = new URL(this.url, BACKEND_URL);
      fetchJson(url);
    }
  }
  createUrl() {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.append("from", this.from.toISOString());
    url.searchParams.append("to", this.to.toISOString());

    if (this.value < 100) {
      url.searchParams.append("price", "low");
    }

    return url.toString();
  }
  createBodyChart() {
    return this.getColumnProps(this.data)
      .map(
        ({ percent, value }) =>
          `<div style="--value: ${value}" data-tooltip="${percent}"></div>`
      )
      .join("");
  }
  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map((item) => {
      return {
        percent: ((item / maxValue) * 100).toFixed(0) + "%",
        value: String(Math.floor(item * scale)),
      };
    });
  }
  update(dateStart, dateEnd) {
    this.from = dateStart;
    this.to = dateEnd;
    this.fetchData();
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
}
