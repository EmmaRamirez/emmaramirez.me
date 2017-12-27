import { ListOptions } from 'components/List';

export interface ElsewhereLink {
  link: string;
  name: string;
}

export class ElsewhereLinks {
  public items: ElsewhereLink[];
  public options: ListOptions;

  constructor(items: ElsewhereLink[], options?: ListOptions) {
    if (options == null) options = {};
    this.items = items;
    this.options = { target: '_self', ...options };
  }
  public render() {
    return `
            <span class='elswhere-links'>
            ${this.items
              .map((item, key) => {
                return `
                    <a class='elsewhere-link' title=${
                      item.name
                    } style='margin: .25rem' href=${item.link}>
                        <img alt=${item.name} src='./${
                  item.name
                }.svg' height='32' />
                    </a>`;
              })
              .join('')}
            </span>
        `;
  }
}
