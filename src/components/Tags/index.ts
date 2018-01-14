import './Tags.styl';

export const Tag = (title:string):string => `<div class='tag'>${title}</div>`;

export class Tags {
    constructor(public tags:string[]) {
        this.tags = tags;
    }

    public render() {
        this.tags.map(t => Tag(t)).join('');
    }
}