import { ContentComponent } from "./components.js";

class BasePage {
  componentMap = {};
  componentElements = {};

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return `
            <div></div>
        `;
  }

  selectComponentElements() {
    const elements = this.element.querySelectorAll("[data-component]");

    for (const element of elements) {
      const name = element.getAttribute("data-component");
      this.componentElements[name] = element;
    }
  }

  render(container) {
    this.element = this.createElement(this.createTemplate());
    this.selectComponentElements();

    for (const [componentName, componentInstance] of Object.entries(
      this.componentMap
    )) {
      componentInstance.render(
        this.componentElements[componentName]
      );
    }

    container.appendChild(this.element);
  }

  destroy() {
    // for (const component of Object.values(this.componentMap)) {
    //     component.destroy();
    // }

    this.element.remove();
  }
}

export class Homepage extends BasePage {
  componentMap = {
    main: new ContentComponent({ content: "Homepage" }),
  };

  createTemplate() {
    return `
            <div>
                <div data-component="main"></div>
            </div>
        `;
  }
}

export class ProductsPage extends BasePage {
  componentMap = {
    // before: new ContentComponent({ content: "before" }),
    main: new ContentComponent({ content: "ProductsPage" }),
    // after: new ContentComponent({ content: "after" }),
  };

  createTemplate() {
    return `
            <div>
                <div data-component="main"></div>
            </div>
        `;
  }
}

export class ProductsPageAdd extends BasePage {
  componentMap = {
    main: new ContentComponent({ content: "ProductsPageAdd" }),
  };

  createTemplate() {
    return `
            <div>
                <div data-component="main"></div>
            </div>
        `;
  }
}

export class Categories extends BasePage {
  componentMap = {
    // before: new ContentComponent({ content: "before" }),
    main: new ContentComponent({ content: "Categories" }),
    // after: new ContentComponent({ content: "after" }),
  };

  createTemplate() {
    return `
            <div>
            <div class="content__top-panel">
              <h1 class="page-title">Категории товаров</h1>
            </div>
            <p>Подкатегории можно перетаскивать, меняя их порядок внутри своей категории.</p>
                <div data-component="main"></div>
            </div>
        `;
  }
}
