import { Component } from 'utils';
import './Tags.styl';

export type TagType = string;
export type TagsType = { tags: string[] };
export const Tag = (title: string): string => `<div class='tag'>${title}</div>`;

export class Tags extends Component<TagsType> {
  constructor(props:TagsType) {
    super(props);
  }

  public render() {
    return this.props.tags
      ? `<div class='tags'>${this.props.tags
          .sort()
          .map(t => Tag(t))
          .join('')}</div>`
      : '';
  }
}
