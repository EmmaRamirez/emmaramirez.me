import './Tags.styl';

export const Tag = (title: string): string => `<div class='tag'>${title}</div>`;

export class Tags {
  constructor(public tags: string[] | undefined) {
    this.tags = tags;
  }

  public render() {
    return this.tags
      ? `<div class='tags'>${this.tags.sort().map(t => Tag(t)).join('')}</div>`
      : '';
  }
}
