import Router from "./browser-router.js";
import { Homepage, ProductsPage, AboutPage } from "./pages-map.js";

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
        path: '/about',
        page: new AboutPage()
    },
];

const router = new Router(container, routes);

router.run();