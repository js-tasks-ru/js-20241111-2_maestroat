import fetchJson from "./utils/fetch-json.js";
import ColumnChartV1 from "../../04-oop-basic-intro-to-dom/1-column-chart/index.js";
const BACKEND_URL = "https://course-js.javascript.ru";
export default class ColumnChart extends ColumnChartV1 {
  chartHeight = 50;
  constructor({
    url = "",
    range = {},
    label = "",
    link = "",
    formatHeading = (data) => data,
    data = [],
    value = 0,
  } = {}) {
    super();
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
    this.createBodyChart = super.createBodyChart.bind(this);
    this.getColumnProps = super.getColumnProps.bind(this);
  }
  selectSubElements() {
    this.element.querySelectorAll("[data-element]").forEach((element) => {
      this.subElements[element.dataset.element] = element;
    });
  }
  async fetchData() {
    let labelLink = () => {
      let str = this.label + this.createLink;
      this.element.firstElementChild.innerHTML = str.trim();
    };
    labelLink();
    try {
      const response = await fetch(this.createUrl());
      const data = await response.json();
      this.data = Object.values(data);
      this.subElements.body.innerHTML = this.createBodyChart();
      let sum = this.data.reduce((sum, el) => sum + el, 0);
      this.subElements.header.textContent = this.formatHeading(sum);
      this.element.classList.remove("column-chart_loading");
      labelLink();
      return data;
    } catch (err) {
      this.element.classList.add("column-chart_loading");
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
  async update(dateStart, dateEnd) {
    this.from = dateStart;
    this.to = dateEnd;
    return await this.fetchData();
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
}
