import './List.scss';

import { Component } from 'utils';
import { Tags, TagsType } from '../Tags';

// TODO: Split into Article & Project interfaces
export interface Item {
  link: string;
  title: string;
  date?: string;
  description?: string;
  draft?: boolean;
  tags?: TagsType;
  image?: string;
  wip?: boolean;
  emoji?: string;
  hide?: boolean;
  lastUpdated?: any;
}

export interface ListOptions {
  target?: '_blank' | '_self' | '_parent' | '_top';
}

export interface ListProps {
  items: Item[];
  options?: ListOptions;
  type?: string;
}

export class List extends Component<ListProps> {
  constructor(props: ListProps) {
    super(props);
  }

  public postRender() {
    const projectOverlays = Array.from(document.querySelectorAll('.project-overlay'));
    projectOverlays.forEach((projectOverlay: HTMLElement) => {
      projectOverlay.addEventListener('click', (event:any) => {
        if (!event.target.classList.contains('tag')) {
          window.open(projectOverlay.dataset.link, '_blank');
        }
      });
    });
  }

  public render() {
    const { items, options, type } = this.props;
    const condition = (condition: any, str: string) => {
      if (condition) return str;
      return '';
    };
    const ul = (innerContent: string) => {
      return `<ul class='${'list ' + (type || '')}'>${ innerContent }</ul>`;
    };
    const formatDate = (date: string | undefined) => {
      if (date == null) return '';
      const d = new Date(date);
      return d.toDateString();
    };
    const noMatches = `<div class='no-items'>No Matching Items Found 😱</div>`;
    if (!items.length) return noMatches;
    // style='background-image: url(${item.image || ''})'
    if (type === 'projects') {
      return ul(items
                .map((item, key) => {
                  return condition(!item.hide, `
                    <li class='list-item project-item' data-key=${key}>
                      <div class='item-last-updated'><img src=${item.lastUpdated} /></div>
                      <div data-link=${item.link}>
                        <div class='project-item-inner'>
                          <span class='item-emoji'>${item.emoji}</span> <a class='item-title' href='${item.link}' target=${options ? options.target : '_self'}>${ item.title }</a>
                            ${condition(item.wip, `<span class='item-wip-badge'>WIP</span>`)}
                          <span class='item-description'>${ item.description }</span>
                          ${condition(item.tags, `${new Tags({ tags: item.tags } as any).render()}`)}
                        </div>
                      </div>
                    </li>
                  `);
                }).join(''));
    }
    return ul(items
              .filter(i => (i.draft == null ? true : !i.draft))
              .map((item, key) => {
                return `
                        <li class='list-item' data-key=${key}>
                            ${condition(item.emoji, `<span class='item-emoji'>${item.emoji}</span>`)}
                            <a href='${item.link}' class='item-title' target=${
                              options ? options.target : '_self'
                            }>${item.title}</a>
                            ${condition(item.wip, `<span class='item-wip-badge'>WIP</span>`)}
                            ${condition(item.description, `<span class='item-description'>${
                              item.description
                            }</span>`)}
                            ${condition(item.date, `<span class='item-date'>${formatDate(item.date)}</span>`)}
                            ${condition(item.tags, `${new Tags({ tags: item.tags } as any).render()}`)}
                        </li>`;
              })
              .join(''));
  }
}