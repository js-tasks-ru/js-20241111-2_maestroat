export default class ColumnChart {
  chartHeight = 50;
  constructor(parameters = {}) {
    const {
      data = [],
      label = "",
      value = 0,
      link = "",
      formatHeading = (data) => data,
    } = parameters;
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.element = this.createElement(this.createTemplate());
  }
  createElement(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  }
  createLink() {
    if (!this.link) {
      return "";
    }
    return `<a href="${this.link}" class="column-chart__link">View all</a>`;
  }
  createTemplate() {
    return `<div class="column-chart ${!this.data.length ? "column-chart_loading" : ""}" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        ${this.label}
        ${this.createLink()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${
  this.formatHeading ? this.formatHeading(this.value) : this.value
}</div>
<div data-element="body" class="column-chart__chart">
        ${this.createBodyChart()}
        </div>
      </div>
  </div>`;
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
  update(newDate) {
    this.data = newDate;
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
}
