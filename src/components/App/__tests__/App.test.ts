import { App } from '..';

const data = require('data.json');

declare var describe: any;

describe('<App />', () => {
  // @ts-ignore: this is a required polyfill
  window.localStorage = {
    getItem: (str: string) => '🌙'
  };

  it('renders', () => {
    const app = new App();
    expect(app.render()).toBeDefined();
    expect(typeof app.render()).toBe('string');
    expect(app.theme).toEqual('🌙');
  });

  it('can contain data', () => {
    const app1 = new App();
    const app2 = new App(data);
    expect(app1.data.projects.length).toBe(0);
    expect(app2.data.projects.length).toBe(data.projects.length);
    expect(app2.data.links.length).toBe(data.links.length);
  });

  it('contains a Header', () => {
    const app = new App(data);
    expect(app.Header).toBeDefined();
    expect(typeof app.Header.render()).toBe('string');
  });

  describe('#appBody()', () => {
    it('works when there is no markdown', () => {
      window.document.body.className = '';
      const app = new App(data);
      expect(typeof app.appBody()).toBe('string');
    });
    it('works when there is markdown', () => {
      window.document.body.className = 'markdown-body';
      window.document.getElementById = (s: string) =>
        ({
          innerHTML: 'test'
        } as any);
      const app = new App(data);
      expect(app.appBody().match(/test/g) || undefined).toBeDefined();
    });
  });
});
