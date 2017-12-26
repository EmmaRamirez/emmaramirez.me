import { State } from 'state';
import { Header } from 'components/Header';
import { Item, List } from 'components/List';

export class App {
    public Header: Header;
    public theme: '☀️' | '🌙';

    constructor() {
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
    }

    private getWritingItems():Item[] {
        return [
            {
                link: '',
                title: 'On Joining (And Leaving) a Techstars Company'
            }
        ];
    }

    private getProjectItems():Item[] {
        return [
            {
                link: '',
                title: 'clickopolis',
                description: 'an incremental empire management game'
            }
        ];
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
                <img style='display: block; margin: 0 auto' src='https://media.giphy.com/media/HPkQKOjUTnfhK/giphy.gif' />
            </div>
        `;
    }

    public postRender() {
        this.Header.postRender();
    }
}