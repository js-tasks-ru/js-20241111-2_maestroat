import SortableTable from "../../05-dom-document-loading/2-sortable-table-v1/index.js";
export default class SortableTableV2 extends SortableTable {
  constructor(headersConfig, { data = [], sorted = {} } = {}) {
    super(headersConfig, data);
    this.sortOnClient = super.sort;
    this.isSortLocally = sorted;
    this.createListeners();
    this.arrowElement = this.createArrowElement();
    this.beginSotring();
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

  createArrowInHeaderCell(element) {
    element.appendChild(this.arrowElement);
  }

  handleHeaderCellClick = (e) => {
    const cellElement = e.target.closest(".sortable-table__cell");
    if (!cellElement) {
      return;
    }
    if (cellElement.dataset.sortable === "false") {
      return;
    }

    const sortField = cellElement.dataset.id;
    let sortOrder = cellElement.dataset.order;

    if (sortOrder === "asc") {
      sortOrder = "desc";
    } else if (sortOrder === "desc") {
      sortOrder = "asc";
    }
    cellElement.dataset.order = sortOrder;
    this.createArrowInHeaderCell(cellElement);
    this.sort(sortField, sortOrder);
  };

  sort(sortField, sortOrder) {
    if (this.isSortLocally) {
      this.sortOnClient(sortField, sortOrder);
    } else {
      this.sortOnServer(sortField, sortOrder);
    }
  }

  beginSotring() {
    const els = this.subElements.header.querySelectorAll(
      ".sortable-table__cell"
    );
    els.forEach((el) => {
      el.dataset.order = "asc";
      if (el.dataset.id === "title") {
        this.createArrowInHeaderCell(el);
        this.sort(el.dataset.id, "asc");
      }
    });

  }

  createListeners() {
    this.subElements.header.addEventListener(
      "pointerdown",
      this.handleHeaderCellClick
    );
  }

  destroyListeners() {
    this.subElements.header.removeEventListener(
      "pointerdown",
      this.handleHeaderCellClick
    );
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}
