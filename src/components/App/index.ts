import { State } from 'state';
import { Header } from 'components/Header';
import { Item, List } from 'components/List';

const data = require('data.json');

export class App {
    public Header: Header;
    public theme: '☀️' | '🌙';

    constructor(public data?:any) {
        this.Header = new Header((event:Event, element:HTMLElement) => {
            const targetNode = document.body;
            if (element.textContent === '🌙') {
                this.theme = '🌙';
                element.textContent = '🌙';
                this.theme = '☀️';
                element.textContent = '☀️';
                if (targetNode) targetNode.className = 'dark';
            } else {
                this.theme = '🌙';
                element.textContent = '🌙';
                if (targetNode) targetNode.className = 'light';
            }
        });
        this.data = data || { articles: [], projects: [] };
    }

    private getWritingItems():Item[] {
        return this.data.articles;
    }

    private getProjectItems():Item[] {
        return this.data.projects;
    }

    public render() {
        return `
            <div class='app'>
                ${ this.Header.render() }
                <div class='posts'>
                    <h2>Writing</h2>
                    ${ new List(this.getWritingItems()).render() }
                    <h2>Projects</h2>
                    ${ new List(this.getProjectItems(), { target: '_blank' }).render() }
                </div>
                <img style='display: block; margin: 0 auto' src='./palms.webp' />
            </div>
        `;
    }

    public postRender() {
        this.Header.postRender();
    }
}