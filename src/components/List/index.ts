import './List.styl';

import { Tags } from 'components/Tags';

export interface Item {
  link: string;
  title: string;
  date?: string;
  description?: string;
  draft?: boolean;
  tags?: string[];
  wip?: boolean;
  emoji?: string;
}

export interface ListOptions {
  target?: '_blank' | '_self' | '_parent' | '_top';
}

export class List {
  public items: Item[];
  public options: ListOptions;

  constructor(items: Item[], options?: ListOptions) {
    if (options == null) options = {};
    this.items = items;
    this.options = { target: '_self', ...options };
  }
  public render() {
    return `
            <ul class='list'>
            ${this.items
              .filter(i => i.draft == null ? true : !i.draft)
              .map((item, key) => {
                return `
                        <li class='list-item' data-key=${key}>
                            ${
                              item.emoji
                                ? `<span class='item-emoji'>${
                                    item.emoji
                                  }</span>`
                                : ''
                            }
                            <a href='${item.link}' target=${
                  this.options.target
                }>${item.title}</a>
                            ${
                              item.wip
                                ? `<span class='item-wip-badge'>WIP</span>`
                                : ''
                            }
                            ${
                              item.description
                                ? `<span class='item-description'>${
                                    item.description
                                  }</span>`
                                : ''
                            }
                            ${
                              item.date
                                ? `<span class='item-date'>${item.date}</span>`
                                : ''
                            }
                            ${
                              item.tags
                                ? '<br>' + new Tags(item.tags).render()
                                : ''
                            }
                        </li>`;
              })
              .join('')}
            </ul>
        `;
  }
}
