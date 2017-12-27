import './Header.styl';

export class Header {
  constructor(public onStyleSwitch: (e: Event, element: HTMLElement) => void) {
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
    return `<header class='header'><span class='site-title'>🍍 emmaramirez</span><span class='site-style-switcher'>🌙</span></header>`;
  }
}
