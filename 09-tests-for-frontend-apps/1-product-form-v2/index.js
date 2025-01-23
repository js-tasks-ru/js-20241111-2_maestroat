import SortableList from '../2-sortable-list/index.js';
import ProductForm from '../../08-forms-fetch-api-part-2/1-product-form-v1/index.js'

export default class ProductFormV2 extends ProductForm {
  constructor (productId) {
    super();
    this.productId = productId;
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
          const el = category.title + " > " + child.title;
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
      this.subElements.imageListContainer.append(
        this.sortableList(product[0].images)
      );
    }
    return this.element;
  }
  sortableList(data) {
    const sortableList = new SortableList({
      items: data.map(el => {
        const element = document.createElement('li');

        element.innerHTML = `
          <input type="hidden" name="url" value="${el.url}">
          <input type="hidden" name="source" value="${el.source}">
          <span>
            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src="${el.url}">
            <span>${el.source}</span>
          </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button>
      `
        return element;
      })
    });
    return sortableList.element;
  }
}


