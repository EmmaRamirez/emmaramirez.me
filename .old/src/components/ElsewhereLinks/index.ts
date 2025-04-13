import { ListOptions } from 'components/List';
import { Component } from 'utils';

export interface ElsewhereLink {
  link: string;
  name: string;
}

export interface ElsewhereLinksProps {
  items: ElsewhereLink[];
  options?: ListOptions;
}

export class ElsewhereLinks extends Component<ElsewhereLinksProps> {
  constructor(props: ElsewhereLinksProps) {
    super(props);
  }
  public render() {
    const { items } = this.props;
    return `
            <span class='elswhere-links'>
            ${items
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
