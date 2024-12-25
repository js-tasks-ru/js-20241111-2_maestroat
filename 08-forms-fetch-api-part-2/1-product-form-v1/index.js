import escapeHtml from "./utils/escape-html.js";
import fetchJson from "./utils/fetch-json.js";

const IMGUR_CLIENT_ID = "28aaa2e823b03b1";
const BACKEND_URL = "https://course-js.javascript.ru";

export default class ProductForm {
  constructor(productId) {
    this.productId = productId;
    this.subElements = {};
    this.element = {};
    this.url = "";
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
          <input required="" type="text" name="title" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer"></div>
        <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" name="subcategory">
        </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" name="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" name="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" name="quantity" placeholder="1">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" name="status">
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
    // console.log(data);
    // console.log(this.subElements);

    if (!data) {
      return;
    }
    this.element = this.createElement(this.createTemplate());
    this.selectSubElements();
    this.createListeners();

    for (let category of data) {
      for (let child of category.subcategories) {
        let el = `${category.title} \u003e ${child.title}`;
        let newOption = new Option(el, child.id);
        this.subElements.productForm.elements.subcategory.append(newOption);
      }
    }

    if (this.productId) {
      const response = await fetch(this.createUrl());
      const product = await response.json();
      if (!product || 0 === product.length) {
        return (this.element.innerHTML =
          '<h1 class="page-title">Страница не найдена</h1>\n        <p>Извините, данный товар не существует</p>');
      }
      // console.log(product);
      // console.log(this.subElements.imageListContainer);

      this.subElements.productForm.elements.title.value = product[0].title;
      this.subElements.productForm.elements.description.value =
        product[0].description;
      this.subElements.productForm.elements.price.value = product[0].price;
      this.subElements.productForm.elements.discount.value =
        product[0].discount;
      this.subElements.productForm.elements.quantity.value =
        product[0].quantity;
      this.subElements.productForm.elements.status.value = product[0].status;
      this.subElements.productForm.elements.subcategory.value =
        product[0].subcategory;
      // console.log(product[0].images);
      let images = product[0].images
        .map((el) => {
          return `<li class="products-edit__imagelist-item sortable-list__item" style="">
          <input type="hidden" name="url" value="${el.url}">
          <input type="hidden" name="source" value="${el.source}">
          <span>
            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src=${el.url}">
            <span>${el.source}</span>
          </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button></li>`;
        })
        .join('');

      this.subElements.imageListContainer.append(
        this.createElement(`<ul class="sortable-list">${images}</ul>`)
      );
    } else {
      (this.subElements.productForm.elements.price.value = 100),
        (this.subElements.productForm.elements.discount.value = 0),
        (this.subElements.productForm.elements.quantity.value = 1);
    }
  }
  createUrl() {
    const products = "/api/rest/products/";
    const url = new URL(products, BACKEND_URL);
    url.searchParams.append("id", this.productId);

    return url.toString();
  }
  createListeners() {
    this.subElements.productForm.addEventListener("submit", this.sendForm);
    this.subElements.productForm.uploadImage.addEventListener(
      "click",
      this.sendImage
    );
  }
  destroyListeners() {
    this.subElements.productForm.removeEventListener("submit", this.sendForm);
    this.subElements.productForm.uploadImage.removeEventListener(
      "click",
      this.sendImage
    );
  }
  sendForm = async (e) => {
    e.preventDefault();
    try {
      let body = this.getFormData();
      this.url = this.createUrl();
      let response = await fetch(this.url, {
        method: body.id ? "PATCH" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      let result = await response.json();
      console.log(result);
      const dispatch = this.productId
        ? new CustomEvent("product-saved")
        : new CustomEvent("product-updated", {
            detail: result.id,
          });
      this.element.dispatchEvent(dispatch);

      // this.subElements.productForm.innerHTML = String(result);
    } catch (err) {
      console.log(err);
      // const url = new URL(this.url, BACKEND_URL);
      fetchJson(this.url);
    }
  };
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
      title: t.value,
      description: i.value,
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
          const result = (await fetchJson("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
              Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
            },
            body: formData,
          })).data.link;
          // console.log(result);
          this.subElements.imageListContainer.append(this.createElement(
            this.renderImageListItem({
              url: result,
              source: file.name,
            }))
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
        // this.subElements.imageListContainer.append({result, file.name});

        inputElement.remove();
      }
    };

    // добавляем элемент для обработки файла и кликаем на него, чтобы было окно выбора файл
    document.body.append(inputElement);
    inputElement.click();
  };
  //   renderImageListItems() {
  //     if (!this.product)
  //         return [];
  //     let e = [];
  //     for (let t of this.product.images)
  //         e.push(this.renderImageListItem(t));
  //     return e
  // }
  renderImageListItem({ url, source }) {
    return `<li class="products-edit__imagelist-item sortable-list__item" style="">
          <input type="hidden" name="url" value="${url}">
          <input type="hidden" name="source" value="${source}">
          <span>
        <img src="icon-grab.svg" data-grab-handle="" alt="grab">
        <img class="sortable-table__cell-img" alt="Image" src=${url}">
        <span>${source}</span>
      </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
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
