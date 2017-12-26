import { Header } from 'components/Header';
import { Item, List } from 'components/List';

export class App {
    public Header:Header;

    constructor() {
        this.Header = new Header((event:Event, element:HTMLElement) => {
            if (element.textContent === '🌙') {
                element.textContent = '☀️';
            } else {
                element.textContent = '🌙';
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
                title: 'smeargle',
                description: 'a palette manager'
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
            </div>
        `;
    }

    public postRender() {
        this.Header.postRender();
    }
}