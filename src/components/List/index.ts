import './List.styl';

export interface Item {
    link: string;
    title: string;
}

export class List {
    public items:Item[];

    constructor(items:Item[]) {
        this.items = items;
    }
    public render() {
        return `
            <ul class='list'>
            ${
                this.items.map((item, key) => {
                    return `<li class='list-item' data-key=${key}><a href='${item.link}'>${item.title}</a></li>`;
                })
            }
            </ul>
        `;
    }
}