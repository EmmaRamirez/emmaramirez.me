import './Header.styl';

export class Header {
  constructor(public onStyleSwitch: (e: Event, element: HTMLElement) => void, public theme: string) {
    this.onStyleSwitch = onStyleSwitch;
  }

  public postRender() {
    const sss = document.querySelector('.site-style-switcher');
    if (sss != null)
      sss.addEventListener('click', e =>
        this.onStyleSwitch(e, sss as HTMLElement)
      );
  }

  public render() {
    return `<header class='header'><a href='/' class='site-title'>🍍 emmaramirez</a><span class='site-style-switcher'>${ this.theme }</span></header>`;
  }
}
