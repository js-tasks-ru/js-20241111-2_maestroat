export default class SortableTable {
  subElements = {};
  constructor(config = [], data = []) {
    this.config = config;
    this.data = data;
    this.element = this.createElement(this.template());
    this.selectSubElements();
  }

  createElement(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  }

  selectSubElements() {
    this.element.querySelectorAll("[data-element]").forEach((element) => {
      this.subElements[element.dataset.element] = element;
    });
  }
  createTableHeaderTemplate() {
    return this.config
      .map(
        (columnConfig) =>
          `
          <div class="sortable-table__cell" data-id="${
  columnConfig["id"]
}" data-sortable="${
  columnConfig["sortable"]}">
            <span>${columnConfig["id"]}</span>
        </div>
        `
      )
      .join("");
  }

  createTableBodyCellTemplate(product, columnConfig) {
    const fieldId = columnConfig["id"];
    if (columnConfig["template"]) {
      return columnConfig["template"](product[fieldId]);
    } else {
      return `<div class="sortable-table__cell">${product[fieldId]}</div>`;
    }
  }

  createTableBodyRowTemplate(product) {
    return `
        <a href="/products/${product["id"]}" class="sortable-table__row">
            ${this.config
              .map((columnConfig) =>
                this.createTableBodyCellTemplate(product, columnConfig)
              )
              .join("")}
        </a>
    `;
  }

  createTableBodyTemplate() {
    return this.data
      .map((product) => this.createTableBodyRowTemplate(product))
      .join("");
  }
  sort(fieldValue, orderValue) {
    this.config.forEach((columnConfig) => {
      if (
        fieldValue &&
        columnConfig["sortable"] !== "false" &&
        fieldValue === columnConfig["id"] &&
        orderValue
      ) {
        if (columnConfig["sortType"] === "string") {
          this.data = this.sortString(this.data, fieldValue, orderValue);
        } else {
          this.data = this.sortNumber(this.data, fieldValue, orderValue);
        }
        this.subElements.body.innerHTML = this.createTableBodyTemplate();
      }
    });
  }

  sortString(data, fieldValue, orderValue) {
    return data.slice().sort((a, b) => {
      if (orderValue === "asc") {
        return a[fieldValue].localeCompare(b[fieldValue], "ru", {
          sensitivity: "variant",
          caseFirst: "upper",
        });
      } else if (orderValue === "desc") {
        return b[fieldValue].localeCompare(a[fieldValue], "ru", {
          sensitivity: "variant",
          caseFirst: "upper",
        });
      }
    });
  }
  sortNumber(data, fieldValue, orderValue) {
    return data.slice().sort((a, b) => {
      if (orderValue === "asc") {
        return a[fieldValue] - b[fieldValue];
      } else if (orderValue === "desc") {
        return b[fieldValue] - a[fieldValue];
      }
    });
  }

  template() {
    return `
        <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.createTableHeaderTemplate()}
            </div>
            <div data-element="body" class="sortable-table__body">
                ${this.createTableBodyTemplate()}
            </div>
            <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
            <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                <div>
                    <p>No products satisfies your filter criteria</p>
                    <button type="button" class="button-primary-outline">Reset all filters</button>
                </div>
            </div>
        </div>
    `;
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
}
