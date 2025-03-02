import Router from "./browser-router.js";
import { Homepage, Products, ProductsPageAdd, ProductsPageEdit, Categories, Sales } from "./pages-map.js";

const container = document.getElementById('content');

const routes = [
  {
    path: '/',
    page: new Homepage()
  },
  {
    path: '/products',
    page: new Products()
  },
  {
    path: '/products/add',
    page: new ProductsPageAdd()
  },
  {
    path: /^\/products\/([\w-]+-([\w-]+)?)/i,
    page: new ProductsPageEdit()
  },
  {
    path: '/categories',
    page: new Categories()
  },
  {
    path: '/sales',
    page: new Sales()
  },
];

const router = new Router(container, routes);

router.run();