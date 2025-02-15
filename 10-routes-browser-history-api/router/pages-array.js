import { ContentComponent, YoutubeComponent, CounterComponent } from './components.js'


class BasePage {
    components = []

    render(container, routeParams) {
        for (const component of this.components) {
            component.render(container, routeParams)
        }
    }

    destroy() {
        for (const component of this.components) {
            component.destroy()
        }
    }
}

export class Homepage extends BasePage {
    components = [
        new ContentComponent({ content: 'before' }),
        new ContentComponent({ content: 'Homepage' }),
        new ContentComponent({ content: 'after' }),
    ]
}

export class YoutubePage extends BasePage {
    components = [
        new ContentComponent({ content: 'before' }),
        new YoutubeComponent(),
        new ContentComponent({ content: 'after' }),
    ] 
}

export class CounterPage extends BasePage {
    components = [
        new ContentComponent({ content: 'before' }),
        new CounterComponent(100),
        new ContentComponent({ content: 'after' }),
    ]
}

export class AboutPage extends BasePage {
    components = [
        new ContentComponent({ content: 'before' }),
        new ContentComponent({ content: 'About' }),
        new ContentComponent({ content: 'after' }),
    ]
}