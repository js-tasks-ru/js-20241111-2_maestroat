import SortableList from "../../09-tests-for-frontend-apps/2-sortable-list/index.js";

import escapeHtml from "./utils/escape-html.js";
import fetchJson from "./utils/fetch-json.js";

const IMGUR_CLIENT_ID = "28aaa2e823b03b1";
const BACKEND_URL = "https://course-js.javascript.ru";

export default class ProductForm {
  constructor(productId) {
    this.productId = productId;
    this.subElements = {};
    this.element = this.createElement(this.createTemplate());
    this.selectSubElements();
    this.createListeners();
  }
  createElement(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  }
  createTemplate() {
    return `<div class="product-form">
    <form data-element="productForm" class="form-grid">
    <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" name="title" class="form-control" placeholder="Название товара" id="title">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара" id="description"></textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer"></div>
        <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" name="subcategory" id="subcategory">
        </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" name="price" class="form-control" placeholder="100" id="price">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" name="discount" class="form-control" placeholder="0" id="discount">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" name="quantity" placeholder="1" id="quantity">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" name="status" id="status">
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>
      </div>
        <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
        </div>
    </form>
  </div>`;
  }
  selectSubElements() {
    this.element.querySelectorAll("[data-element]").forEach((element) => {
      this.subElements[element.dataset.element] = element;
    });
  }
  async render() {
    const url =
      "https://course-js.javascript.ru/api/rest/categories?_sort=weight&_refs=subcategory";
    const response = await fetch(url);
    const data = await response.json();

    if (!data) {
      return;
    }

    if (this.productId) {
      const response = await fetch(this.createUrl());
      const product = await response.json();
      if (!product || 0 === product.length) {
        return (this.element.innerHTML =
          '<h1 class="page-title">Страница не найдена</h1>\n<p>Извините, данный товар не существует</p>');
      }
  
      for (let category of data) {
        for (let child of category.subcategories) {
          const el = `${category.title} \u003e ${child.title}`;
          // const el = category.title + " > " + child.title;
          const newOption = new Option(el, child.id);
          this.subElements.productForm.elements.subcategory.append(newOption);
        }
      }

      if (product[0]) {
        const {
          title,
          description,
          subcategory,
          price,
          quantity,
          discount,
          status,
        } = this.subElements.productForm.elements;

        title.value = product[0].title;
        description.value = product[0].description;
        price.value = product[0].price;
        discount.value = product[0].discount;
        quantity.value = product[0].quantity;
        status.value = product[0].status;
        subcategory.value = product[0].subcategory;
      }
      else {
        price.value = 100;
        discount.value = 0;
        quantity.value = 1;
      }

      const sortableList = new SortableList({
        items: product[0].images.map(el => {
          const element = document.createElement('li');
    
          element.innerHTML = `
            <input type="hidden" name="url" value="${el.url}">
        <input type="hidden" name="source" value="${el.source}">
        <span>
          <img src="/10-routes-browser-history-api/5-product-add-page/icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="Image" src="${el.url}">
          <span>${el.source}</span>
        </span>
        <button type="button">
          <img src="/10-routes-browser-history-api/5-product-add-page/icon-trash.svg" data-delete-handle="" alt="delete">
        </button>
          `;

          return element;
        })
      });

      this.subElements.imageListContainer.append(sortableList.element);
    }
    return this.element;
  }
  createUrl() {
    const products = "/api/rest/products/";
    const url = new URL(products, BACKEND_URL);
    url.searchParams.append("id", this.productId);

    return url.toString();
  }
  createListeners() {
    this.subElements.productForm.addEventListener("submit", this.sendForm);
    this.subElements.productForm.elements.uploadImage.addEventListener(
      "click",
      this.sendImage
    );
  }
  destroyListeners() {
    this.subElements.productForm.removeEventListener("submit", this.sendForm);
    this.subElements.productForm.elements.uploadImage.removeEventListener(
      "click",
      this.sendImage
    );
  }
  sendForm = async (e) => {
    e.preventDefault();
    this.save();
  };
  save = async () => {
    try {
      const body = this.getFormData();
      const url = this.createUrl();
      const response = await fetch(url, {
        method: body.id ? "PATCH" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      // console.log(result);
      const dispatch = this.productId
        ? new CustomEvent("product-updated", {detail: result.id})
        : new CustomEvent("product-saved", {detail: result.id});
      this.element.dispatchEvent(dispatch);

    } catch (err) {
      console.log(err);
    }
  }
  getFormData() {
    const {
      title: t,
      description: i,
      subcategory: s,
      price: r,
      quantity: n,
      discount: o,
      status: l,
    } = this.subElements.productForm.elements;

    return {
      id: this.productId,
      title: escapeHtml(t.value),
      description: escapeHtml(i.value),
      subcategory: s.value,
      price: parseInt(r.value, 10),
      quantity: parseInt(n.value, 10),
      discount: parseInt(o.value, 10),
      status: parseInt(l.value, 10),
      images: [],
    };
  }
  sendImage = async () => {
    const inputElement = document.createElement("input");

    inputElement.type = "file";
    inputElement.accept = "image/*";

    inputElement.onchange = async () => {
      const [file] = inputElement.files; // берем первый файл из массива файлов

      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        this.subElements.productForm.uploadImage.classList.add("is-loading");
        // логика для показа лоадера
        try {
          const result = (
            await fetchJson("https://api.imgur.com/3/image", {
              method: "POST",
              headers: {
                Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
              },
              body: formData,
            })
          ).data.link;
          
          this.subElements.imageListContainer.firstElementChild.append(
            this.createElement(
              this.renderImageListItem({
                url: result,
                source: file.name,
              })
            )
          );
        } catch (err) {
          console.log(err);
        } finally {
          // логика для скрытия лоадера
          // логика для добавления изображения в DOM
          this.subElements.productForm.uploadImage.classList.remove(
            "is-loading"
          );
        }
        inputElement.remove();
      }
    };
    // добавляем элемент для обработки файла и кликаем на него, чтобы было окно выбора файл
    document.body.append(inputElement);
    inputElement.click();
  };
  renderImageListItem({ url, source }) {
    return `<li class="products-edit__imagelist-item sortable-list__item" style="">
          <input type="hidden" name="url" value="${url}">
          <input type="hidden" name="source" value="${source}">
          <span>
        <img src="./icon-grab.svg" data-grab-handle="" alt="grab">
        <img class="sortable-table__cell-img" alt="Image" src="${url}">
        <span>${source}</span>
      </span>
          <button type="button">
            <img src="./icon-trash.svg" data-delete-handle="" alt="delete">
          </button></li>
        `;
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
    this.destroyListeners();
  }
}
