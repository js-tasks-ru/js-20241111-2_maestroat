export default class Router {
    lastRoute;

    constructor(container, routes) {
        this.container = container;
        this.routes = routes;
    }

    processHash(rawUrl) {
        const url = new URL(rawUrl);
        return url.hash.slice(1);
    }

    processPath(path) {
        for (const route of this.routes) {
            const useRoute = route.path instanceof RegExp
                ? route.path.test(path)
                : route.path === path;

            if (useRoute) {
                if (this.lastRoute) {
                    this.lastRoute.component.destroy();
                }
                const routeParams = this.extractRouteParams(route, path);
                route.component.render(this.container, routeParams);
                this.lastRoute = route;
            }
        }
    }

    extractRouteParams(route, path) {
        if (route.path instanceof RegExp) {
            const result = path.match(route.path);
            if (result) {
                return result.slice(1);
            }
        }
        return [];
    }

    handleWindowHashchange = (e) => {
        const path = this.processHash(e.newURL);
        this.processPath(path);
    }

    run() {
        const path = this.processHash(window.location.href);

        this.processPath(path);

        window.addEventListener("hashchange", this.handleWindowHashchange);
    }

    destroy() {
        window.removeEventListener("hashchange", this.handleWindowHashchange);
    }
}
