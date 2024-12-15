import fetchJson from "./utils/fetch-json.js";
import SortableTableV2 from "../../04-oop-basic-intro-to-dom/1-column-chart/index.js";
const BACKEND_URL = "https://course-js.javascript.ru";
export default class ColumnChart extends SortableTableV2 {
  constructor(parameters, otherParameters = {}) {
    super(parameters);
    const { data = [], value = 0, formatHeading = (data) => data } = parameters;
    const { url = "", range = {}, label = "", link = "" } = otherParameters;
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.url = url;
    this.from = range.from ?? null;
    this.to = range.to ?? null;
    this.formatHeading = formatHeading;
    this.subElements = {};
    this.selectSubElements();
    this.createBodyChart = super.createBodyChart.bind(this);

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
      const data = await response.json();

      this.data = data;
      this.subElements.body = this.createBodyTemplate();
    } catch (err) {
      // @TODO
    }
  }
  createUrl() {
    console.log(this.otherParameters); //undefined - почему??

    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.append("from", this.from);
    url.searchParams.append("to", this.to);

    if (this.value < 100) {
      url.searchParams.append("price", "low");
    }

    return url.toString();
  }
  update(dateStart, dateEnd) {
    this.from = dateStart;
    this.to = dateEnd;
    this.fetchData();
  }
  createBodyTemplate() {
    console.log(ok);
    return this.createBodyChart();
  }
}
