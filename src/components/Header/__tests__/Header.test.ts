import { Header } from '..';

declare var describe: any;

describe('<Header />', () => {
  it('renders', () => {
    const header = new Header();
    expect(header).toBeDefined();
    expect(typeof header.render()).toBeDefined();
    expect(header.render()).toEqual(
      `<header class='header'><a href='/' class='site-title'>🍍 emmaramirez</a></header>`
    );
  });
});
