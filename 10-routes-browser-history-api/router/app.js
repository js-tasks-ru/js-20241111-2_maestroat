import Router from "./browser-router.js";
import Page from "../1-dashboard-page/index.js";
import ProductsPage from "../2-products-page/index.js";
import ProductAddPage from "../5-product-add-page/index.js";
import CategoriesPage from "../3-categories-page/index.js";
import SalesPage from "../4-sales-page/index.js";

const container = document.getElementById('content');

const routes = [
  {
    path: '/',
    page: new Page()
  },
  {
    path: '/products',
    page: new ProductsPage()
  },
  {
    path: '/products/add',
    page: new ProductAddPage()
  },
  {
    path: /^\/products\/([\w-]+-([\w-]+)?)/i,
    // path: '/products/102-planset-apple-ipad-2019-32-gb--seryj',
    page: new ProductAddPage()
  },
  {
    path: '/categories',
    page: new CategoriesPage()
  },
  {
    path: '/sales',
    page: new SalesPage()
  },
];

const router = new Router(container, routes);

router.run();