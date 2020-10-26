import { Component } from 'utils';
import './Tags.scss';

export type TagType = string;
export type TagsType = { tags: string[] };
export const Tag = ({
    title,
    index,
    isHighlighted,
}: {
  title: string,
  index: number,
  isHighlighted: boolean,
}): string => `<a href='/tags/${title.replace(/\s/g, '-')}' style='border: 1px solid hsl(${index * 36}, 70%, 60%)' class='tag ${isHighlighted ? 'highlight' : ''}'><span class='tag-inner'>${title}</span></a>`;

export class Tags extends Component<TagsType> {
  constructor(props: TagsType) {
    super(props);
  }

  public render() {
    const isInTags = window.location.pathname.includes('tags');
    const isSelected = (t: string) => isInTags && window.location.pathname.includes(t);

    return this.props.tags
      ? `<div class='tags'>${this.props.tags
          .sort()
          .map((t, i) => Tag({title: t, index: i, isHighlighted: isSelected(t) }))
          .join('')}</div>`
      : '';
  }
}
