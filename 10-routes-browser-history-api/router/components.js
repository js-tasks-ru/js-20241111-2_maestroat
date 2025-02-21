import Page from "../1-dashboard-page/index.js";
import CategoriesPage from "../3-categories-page/index.js";
import ProductFormV2 from "../../08-forms-fetch-api-part-2/1-product-form-v1/index.js";

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

  // render(container, routeParams) {
  //     this.routeParams = routeParams;
  //     this.element = this.createElement(this.createTemplate());
  //     this.selectSubElements();
  //
  //     container.appendChild(this.element);
  // }
  //
  destroy() {
    this.element.remove();
  }
}
export class ContentComponent extends BaseComponent {
  constructor({ content }) {
    super();
    this.content = content;
  }

  render(container, routeParams) {
    console.log(this.content);
    switch (this.content) {
    case "ProductsPage":
      const productId =
          "101-planset-lenovo-tab-p10-tb-x705l-32-gb-3g-lte-belyj";
      const productForm = new ProductFormV2(productId);

      const renderForm = async () => {
        await productForm.render();

        productForm.element.addEventListener("product-saved", (event) => {
          console.error("product-saved", event.detail);
        });

        productForm.element.addEventListener("product-updated", (event) => {
          console.error("product-updated", event.detail);
        });
        container.innerHTML = "";
        container.append(productForm.element);
      };
      renderForm();
      break;

    case "Homepage":
      async function initialize() {
        const page = new Page();
        const element = await page.render();

        container.innerHTML = "";
        container.append(element);
      }
      initialize();
      break;

    case "Categories":
      async function initialize2() {
        const categoriesPage = new CategoriesPage();
        const element = await categoriesPage.render();

        container.innerHTML = "";
        container.append(element);
      }
      initialize2();
      break;

    default:
      /*
                    здесь код, который выполнится в случае,
                    если не совпала ни с одним значением
                */
      break;
    }
  }
}
