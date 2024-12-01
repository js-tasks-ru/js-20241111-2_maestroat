export default class SortableTable {
  constructor(config = [], data = []) {
    this.config = config;
    this.data = data;
    this.element = this.createElement(this.template());
  }
  static value = null;
  static fieldValueCheck = "title";
  static orderValueCheck = "asc";

  createElement(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  }
  createTableHeaderTemplate() {
    return this.config
      .map(
        (columnConfig) =>
          `
          <div class="sortable-table__cell" data-id="${
            columnConfig["id"]
          }" data-sortable="${
            columnConfig["id"] === "images" ? "false" : "true"
          }" data-order="asc">
            <span>${columnConfig["id"]}</span>
        </div>
        `
      )
      .join("");
  }

  createTableBodyCellTemplate(product, columnConfig) {
    const fieldId = columnConfig["id"];
    if (fieldId === "images") {
      // console.log(product[fieldId][0]?.url);
      return `
      <div class="sortable-table__cell">
        <img class="sortable-table-image" alt="Image" src="${
          product[fieldId][0]?.url || "https://via.placeholder.com/32"
        }">
      </div>
    `;
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
    if (this.fieldValueCheck === fieldValue && this.orderValueCheck === orderValue) {
      return;
    }
    else {
      this.fieldValueCheck = fieldValue;
      this.orderValueCheck = orderValue;
    }
    this.config.forEach((columnConfig) => {
      if (fieldValue && columnConfig["sortable"] !== "false" && fieldValue === columnConfig.id && orderValue) {
        if (columnConfig.sortType === "string") {
          this.sortString(fieldValue, orderValue);
        } else {
          this.sortNumber(fieldValue, orderValue);
        }
        // console.log(this.data);
        // this.remove();
        // this.element = this.createElement(this.template());
        // const root = document.querySelector("#root");
        // if (root) {
        //   root.append(this.element);
        // }
        const table = document.querySelector('[data-element="body"]');
        SortableTable.value = this.createTableBodyTemplate();
        table.innerHTML = SortableTable.value;
      }
    });
  }
  sortString(param, orderValue) {
    this.data = this.data.slice().sort((a, b) => {
      if (orderValue === "asc") {
        return a[param].localeCompare(b[param], "ru", {
          sensitivity: "variant",
          caseFirst: "upper",
        });
      } else if (orderValue === "desc") {
        return b[param].localeCompare(a[param], "ru", {
          sensitivity: "variant",
          caseFirst: "upper",
        });
      }
    });
  }
  sortNumber(param, orderValue) {
    this.data = this.data.slice().sort((a, b) => {
      if (orderValue === "asc") {
        return a[param] - b[param];
      } else if (orderValue === "desc") {
        return b[param] - a[param];
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
