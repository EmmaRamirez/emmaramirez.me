import { Header } from 'components/Header';
import { Item, List } from 'components/List';

export class App {
    constructor() {

    }

    private getItems():Item[] {
        return [
            {
                link: '',
                title: 'On Joining (And Subsequently Leaving) a Techstars Company'
            }
        ];
    }

    public render() {
        return `
            <div class='app'>
                ${ new Header().render() }
                ${ new List(this.getItems()).render() }
            </div>
        `;
    }
}