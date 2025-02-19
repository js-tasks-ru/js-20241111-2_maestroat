import Router from "./browser-router.js";
import { Homepage, ProductsPage, Categories } from "./pages-map.js";

const container = document.getElementById('content');

const routes = [
  {
    path: '/',
    page: new Homepage()
  },
  {
    path: '/products',
    page: new ProductsPage()
  },
  {
    path: '/categories',
    page: new Categories()
  },
];

const router = new Router(container, routes);

router.run();