import './List.styl';

export interface Item {
    link: string;
    title: string;
    description?: string;
}

export interface ListOptions {
    target?: '_blank' | '_self' | '_parent' | '_top';
}

export class List {
    public items:Item[];
    public options:ListOptions;

    constructor(items:Item[], options?: ListOptions) {
        if (options == null) options = {};
        this.items = items;
        this.options = { target: '_self', ...options };
    }
    public render() {
        return `
            <ul class='list'>
            ${
                this.items.map((item, key) => {
                    return `
                        <li class='list-item' data-key=${key}>
                            <a href='${item.link}' target=${this.options.target}>${item.title}</a>
                            ${ item.description ? `<span class='item-description'>${item.description}</span>` : '' }
                        </li>`;
                })
            }
            </ul>
        `;
    }
}