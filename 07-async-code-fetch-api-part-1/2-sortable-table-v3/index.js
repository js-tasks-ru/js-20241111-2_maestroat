import fetchJson from "./utils/fetch-json.js";
import SortableTableV2 from "../../06-events-practice/1-sortable-table-v2/index.js";

const BACKEND_URL = "https://course-js.javascript.ru";

export default class SortableTableV3 extends SortableTableV2 {
  loading = false;
  constructor(
    headersConfig,
    {
      url = "",
      sorted = {
        id: headersConfig.find((item) => item.sortable).id,
        order: "asc",
      },
      isSortLocally = false,
      step = 20,
      start = 1,
      end = start + step,
    } = {}
  ) {
    super(headersConfig);
    this.url = url;
    this.headersConfig = headersConfig;
    this.data = [];
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.step = step;
    this.start = start;
    this.end = end;

    this.render();
  }
  async render() {
    const { id, order } = this.sorted;
    this.data = await this.loadData(id, order, this.start, this.end);
    this.subElements.body.innerHTML = this.createTableBodyTemplate();
    this.initEventListeners();
  }
  async sortOnServer(id, order) {
    this.data = await this.loadData(id, order, 1, 1 + this.step);
    this.subElements.body.innerHTML = this.createTableBodyTemplate();
  }
  async loadData(id, order, start, end) {
    const url = new URL(this.url, BACKEND_URL);

    url.searchParams.set("_sort", id);
    url.searchParams.set("_order", order);
    url.searchParams.set("_start", start);
    url.searchParams.set("_end", end);

    this.element.classList.add("sortable-table_loading");

    const data = await fetchJson(url.toString());

    if (!data || 0 === data.length) {
      this.element.classList.add("sortable-table_empty");
      return (this.element.innerHTML = "<div>Нет данных</div>");
    } else {
      this.element.classList.remove("sortable-table_empty");
    }
    this.element.classList.remove("sortable-table_loading");

    return data;
  }
  initEventListeners() {
    document.addEventListener("scroll", this.onWindowScroll);
  }
  onWindowScroll = async () => {
    const { bottom } = this.element.getBoundingClientRect();
    const { id, order } = this.sorted;
    if (bottom < document.documentElement.clientHeight && !this.loading) {
      this.loading = true;
      this.start = this.end;
      this.end = this.start + this.step;
      this.data = await this.loadData(id, order, this.start, this.end);
      if (this.isSortLocally) {
        this.headersConfig.forEach((columnConfig) => {
          if (
            id &&
            columnConfig["sortable"] !== "false" &&
            id === columnConfig["id"] &&
            order
          ) {
            if (columnConfig["sortType"] === "string") {
              this.data = this.sortString(this.data, id, order);
            } else {
              if (columnConfig["sortType"] === "number") {
                this.data = this.sortNumber(this.data, id, order);
              }
            }
            this.update();
          }
        });
      }
      if (!this.isSortLocally) {
        this.update();
      }
      this.loading = false;
    }
  };
  update() {
    const rows = document.createElement("div");

    // this.data = data;
    rows.innerHTML = this.createTableBodyTemplate();

    this.subElements.body.append(...rows.childNodes);
  }
  destroyListeners() {
    document.removeEventListener("scroll", this.onWindowScroll);
  }
  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}
