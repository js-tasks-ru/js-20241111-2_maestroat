import Page from "../1-dashboard-page/index.js";
import ProductsPage from "../2-products-page/index.js";
import CategoriesPage from "../3-categories-page/index.js";
import ProductAddPage from "../5-product-add-page/index.js";
import SalesPage from "../4-sales-page/index.js";
class BasePage {
  constructor() {
    this.content = content;
    this.page = null;
    this.element = null;
    this.routeParams = null;
  }
  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }
  createTemplate() {
    return `<div></div>`;
  }
  async render(container, routeParams) {
    this.element = this.createElement(this.createTemplate());
    this.routeParams = routeParams;
  
    const element = await this.page.render();
  
    container.innerHTML = '';
    container.append(element);
  }
  destroy() {
    this.element.remove();
  }
}
export class Homepage extends BasePage {
  constructor() {
    super();
    this.page = new Page();
  }
}
export class Products extends BasePage {
  constructor() {
    super();
    this.page = new ProductsPage();
  }
}
export class ProductsPageAdd extends BasePage {
  constructor() {
    super();
    this.page = new ProductAddPage();
  }
}
export class ProductsPageEdit extends BasePage {
  constructor() {
    super();
    this.page = new ProductAddPage();
  }
  async render(container, routeParams) {
    this.page = new ProductAddPage(routeParams);
    super.render(container, routeParams);
  }
}
export class Categories extends BasePage {
  constructor() {
    super();
    this.page = new CategoriesPage();
  }
}
export class Sales extends BasePage {
  constructor() {
    super();
    this.page = new SalesPage();
  }
}