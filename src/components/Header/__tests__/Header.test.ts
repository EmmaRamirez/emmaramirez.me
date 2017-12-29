import { Header } from '..';

declare var describe: any;

describe('Header', () => {

  it('renders', () => {
    const header = new Header((e, el) => null, '🌙');
    expect(header).toBeDefined();
    expect(typeof header.render()).toBeDefined();
    expect(header.render()).toEqual(
      `<header class='header'><a href='/' class='site-title'>🍍 emmaramirez</a><span class='site-style-switcher'>🌙</span></header>`
    );
  });

  it('has a postRender', () => {
    const header = new Header((e, el) => ({ e, el }), 'test');
    expect(header.postRender).toBeDefined();
  });
});
