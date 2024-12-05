import SortableTable from "../../05-dom-document-loading/2-sortable-table-v1/index.js";
export default class SortableTableV2 extends SortableTable {
  constructor(headersConfig, { data = [], sorted = {} } = {}) {
    super(headersConfig, data);
    this.sortOnClient = super.sort;
    this.config = headersConfig;
    this.data = data;
    this.isSortLocally = sorted;
    this.element = this.createElement(super.template());
    this.subElements = {};
    this.selectSubElements();
    this.createListeners();
    this.arrowElement = this.createArrowElement();
    this.beginSotring();
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

  createArrowElement() {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = this.createArrowTemplate();
    return tempElement.firstElementChild;
  }

  createArrowTemplate() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
      </span>`;
  }

  handleHeaderPointerDown(element) {
    element.appendChild(this.arrowElement);
  }

  handleHeaderCellClick = (e) => {
    const cellElement = e.target.closest(".sortable-table__cell");
    if (!cellElement) {
      return;
    }
    // @TODO: sortable property data-sortable is not empty
    if (cellElement.dataset.sortable === "false") {
      return;
    }
    if (cellElement.dataset.id === "title") {
      cellElement.querySelector('[data-element="arrow"]')?.remove();
    }

    this.handleHeaderPointerDown(cellElement);

    const sortField = cellElement.dataset.id;
    let sortOrder = cellElement.dataset.order; // @TODO:

    if (sortOrder === "asc") {
      sortOrder = "desc";
    } else {
      sortOrder = "asc";
    }
    cellElement.dataset.order = sortOrder;

    this.sort(sortField, sortOrder);
  };

  sort(sortField, sortOrder, status) {
    // «пользовательская» сортировка по статусу заказа
    if (status === 1) {
      this.data = data.slice().filter((el) => el["status"] === 1);
      this.subElements.body.innerHTML = super.createTableBodyTemplate();
    } else {
      if (status === 0) {
        this.data = data.slice().filter((el) => el["status"] === 0);
        this.subElements.body.innerHTML = super.createTableBodyTemplate();
      }
    }

    if (this.isSortLocally) {
      this.sortOnClient(sortField, sortOrder);
    } else {
      this.sortOnServer();
    }
  }

  beginSotring() {
    const el = this.subElements.header.querySelector('[data-id="title"]');
    el.innerHTML = el.innerHTML + this.createArrowTemplate();
    el.dataset.order = "asc";
    this.sort(el.dataset.id, "asc");
  }

  createListeners() {
    this.subElements.header.addEventListener(
      "click",
      this.handleHeaderCellClick
    );
  }

  destroyListeners() {
    this.subElements.header.removeEventListener(
      "click",
      this.handleHeaderCellClick
    );
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}
