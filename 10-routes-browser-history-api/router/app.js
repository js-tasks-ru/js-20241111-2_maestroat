import Router from "./browser-router.js";
import Page from "../1-dashboard-page/index-my.js";
import ProductsPage from "../2-products-page/index.js";
import ProductAddPage from "../5-product-add-page/index.js";
import CategoriesPage from "../3-categories-page/index.js";
import SalesPage from "../4-sales-page/index.js";
import "../../styles.css";
import "../2-products-page/style-slider.css";
import "../5-product-add-page/style.css";

const container = document.getElementById('content');

const routes = [
  {
    path: '/',
    page: new Page(container)
  }, 
  {
    path: '/products',
    page: new ProductsPage(container)
  },
  {
    path: '/products/add',
    page: new ProductAddPage(container)
  },
  {
    path: /^\/products\/([\w-]+-([\w-]+)?)/i,
    // path: '/products/102-planset-apple-ipad-2019-32-gb--seryj',
    page: new ProductAddPage(container)
  },
  {
    path: '/categories',
    page: new CategoriesPage(container)
  },
  {
    path: '/sales',
    page: new SalesPage(container)
  },
];

const router = new Router(routes);

router.run();