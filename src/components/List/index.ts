import './List.styl';

import { Component } from 'utils';
import { Tags, TagsType } from 'components/Tags';

export interface Item {
  link: string;
  title: string;
  date?: string;
  description?: string;
  draft?: boolean;
  tags?: TagsType;
  wip?: boolean;
  emoji?: string;
}

export interface ListOptions {
  target?: '_blank' | '_self' | '_parent' | '_top';
}

export interface ListProps {
  items: Item[],
  options?: ListOptions
}

export class List extends Component<ListProps> {
  public items: Item[];
  public options: ListOptions;

  constructor(props: ListProps) {
    super(props);
  }

  public render() {
    const { items, options } = this.props;

    return `
            <ul class='list'>
            ${items
              .filter(i => (i.draft == null ? true : !i.draft))
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
                  options ? options.target : '_self'
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
