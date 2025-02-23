import Page from "../1-dashboard-page/index.js";
import ProductsPage from "../2-products-page/index.js";
import CategoriesPage from "../3-categories-page/index.js";
import ProductAddPage from "../5-product-add-page/index.js";

class BaseComponent {
  element;
  subElements = {};

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  selectSubElements() {
    const elements = this.element.querySelectorAll("[data-element]");

    for (const element of elements) {
      const name = element.getAttribute("data-element");
      this.subElements[name] = element;
    }
  }

  createTemplate() {
    return `<div></div>`;
  }

  render() {
    this.element = this.createElement(this.createTemplate());
    this.selectSubElements();
    return this.element;
  }
  destroy() {
    this.element.remove();
  }
}
export class ContentComponent extends BaseComponent {
  constructor({ content }) {
    super();
    this.content = content;
    this.page = null;
  }
  async render(container) {
    switch (this.content) {
    case "Homepage":
      this.page = new Page();
      break;
    case "ProductsPage":
      this.page = new ProductsPage();
      break;
    case "ProductsPageAdd":
      const productId = "101-planset-lenovo-tab-p10-tb-x705l-32-gb-3g-lte-belyj";
      this.page = new ProductAddPage(productId);
      break;
    case "Categories":
      this.page = new CategoriesPage();
      break;
    }
    const element = await this.page.render();

    container.innerHTML = '';
    container.append(element);
  }
}
