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
                    <img style='display: block; margin: 3rem auto' src='./palms.webp' />
                    <br />
                    <h2>Elsewhere</h2>
                    <a title='github' style='margin: .25rem' href='https://github.com/EmmaRamirez/emmaramirez.me'>
                        <img alt='github' src='./github.svg' height='32' />
                    </a>
                    <a title='keybase' style='margin: .25rem' href='https://keybase.io/emmaramirez'>
                        <img alt='keybase' src='./keybase.svg' height='32' />
                    </a>
                    <a title='twitter' style='margin: .25rem' href='https://twitter.com/emmagramirez'>
                        <img alt='twitter' src='./twitter.svg' height='32' />
                    </a>
                    <div class='monospace'>Bitcoin: 16mM8fFqLsAFZ9J6v1Efr3Ba8mT18RuZLW</div>
                    <div class='monospace'>Ethereum: 0x67cee0981f84Cc86A0eC7491e2d19cd8476d0A42</div>
                </div>
            </div>
        `;
    }

    public postRender() {
        this.Header.postRender();
    }
}