import { ContentComponent } from './components.js'

class BasePage {
    componentMap = {}
    componentElements = {};

    createElement(template) {
        const element = document.createElement('div');
        element.innerHTML = template;
        return element.firstElementChild;
    }

    createTemplate() {
        return (`
            <div></div>
        `);
    }

    selectComponentElements() {
        const elements = this.element.querySelectorAll('[data-component]');

        for (const element of elements) {
            const name = element.getAttribute('data-component');
            this.componentElements[name] = element;
        }
    }

    render(container, routeParams) {
        this.element = this.createElement(this.createTemplate());
        this.selectComponentElements();

        for (const [componentName, componentInstance] of Object.entries(this.componentMap)) {
            componentInstance.render(
                this.componentElements[componentName],
                routeParams
            )
        }

        container.appendChild(this.element);
    }

    destroy() {
        // for (const component of Object.values(this.componentMap)) {
        //     component.destroy();
        // }

        this.element.remove();
    }
}

export class Homepage extends BasePage {
    componentMap = {
        main: new ContentComponent({ content: 'Homepage' }),
    }

    createTemplate() {
        return (`
            <div>
                <div data-component="main"></div>
            </div>
        `);
    }
}

export class ProductsPage extends BasePage {
    componentMap = {
        main: new ContentComponent({ content: 'ProductsPage' }),
    }

    createTemplate() {
        return (`
            <div>
                <div data-component="main"></div>
            </div>
        `);
    }
}

export class AboutPage extends BasePage {
    componentMap = {
        before: new ContentComponent({ content: 'before' }),
        main: new ContentComponent({ content: 'content' }),
        after: new ContentComponent({ content: 'after' }),
    }

    createTemplate() {
        return (`
            <div>
                <h1>About page</h1>
                <div data-component="before"></div>
                <div data-component="main"></div>
                <div data-component="after"></div>
            </div>
        `);
    }
}