import { App } from '..';
import { Header } from 'components/Header';

const data = require('data.json');

declare var describe: any;

describe('<App />', () => {
  // @ts-ignore: this is a required polyfill
  window.localStorage = {
    getItem: (str: string) => '🌙'
  };

  it('renders', () => {
    const app = new App({ Header: new Header(), data: {} });
    expect(app.render()).toBeDefined();
    expect(typeof app.render()).toBe('string');
  });

  it('can contain data', () => {
    const app1 = new App({
      Header: new Header(),
      data: {
        projects: [],
        links: [],
        articles: []
      }
    });
    const app2 = new App({ Header: new Header(), data: data });
    // @ts-ignore: test
    expect(app1.props.data.projects.length).toBe(0);
    // @ts-ignore: test
    expect(app2.props.data.projects.length).toBe(data.projects.length);
    // @ts-ignore: test
    expect(app2.props.data.links.length).toBe(data.links.length);
  });

  it('contains a Header', () => {
    const app = new App({ Header: new Header(), data });
    // @ts-ignore
    expect(app.props.Header).toBeDefined();
    // @ts-ignore
    expect(typeof app.props.Header.render()).toBe('string');
  });

  describe('#appBody()', () => {
    it('works when there is no markdown', () => {
      window.document.body.className = '';
      const app = new App({ Header: new Header(), data: data });
      expect(typeof app.appBody()).toBe('string');
    });
    xit('works when there is markdown', () => {
      window.document.body.className = 'markdown-body';
      window.document.getElementById = (s: string) =>
        ({
          innerHTML: 'test'
        } as any);
      const app = new App({ Header: new Header(), data: data });
      expect(app.appBody().match(/test/g) || undefined).toBeDefined();
    });
  });
});
