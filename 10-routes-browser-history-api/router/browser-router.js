export default class Router {
    lastRoute;

    constructor(routes) {
      this.routes = routes;
    }

    processPath(path) {
      for (const route of this.routes) {
        const useRoute = route.path instanceof RegExp
          ? route.path.test(path)
          : route.path === path;

        if (useRoute) {
          if (this.lastRoute) {
            this.lastRoute.page.destroy();
          }
          const routeParams = this.extractRouteParams(route, path);
          route.page.render(routeParams[0]);
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

    handleDocumentClick = (e) => {
      const linkElement = e.target.closest('a');
      if (!linkElement) {
        return;
      }
      e.preventDefault();
      const url = new URL(linkElement.href);
      history.pushState(null, undefined, url.pathname);
      this.processPath(url.pathname);
    }

    historyChange = () => {
      this.processPath(window.location.pathname);
    }
    run() {
      const url = new URL(window.location.href);

      this.processPath(url.pathname);

      document.addEventListener("click", this.handleDocumentClick);
      window.addEventListener('popstate', this.historyChange);
    }

    destroy() {
      document.removeEventListener("click", this.handleDocumentClick);
      window.removeEventListener('popstate', this.historyChange);
    }
}
