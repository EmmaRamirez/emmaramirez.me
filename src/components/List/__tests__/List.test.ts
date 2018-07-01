import { Item, List, ListOptions } from '..';

const data = require('data.json');

declare var describe: any;

describe('<List />', () => {
  it('renders', () => {
    const list = new List({ items: data.projects });
    expect(list.render()).toBeDefined();
  });

  it('can contain data', () => {
    const list = new List({ items: data.projects });
    expect(list.props.items.length).toBe(data.projects.length);
  });

  it('can have a type', () => {
    const list = new List({ items: [ { link: '', title: '' }], options: {}, type: 'test-list' });
    expect(list.props.type).toBe('test-list');
    // @ts-ignore
    expect(list.render().match(/test-list/g).length).toBeGreaterThan(0);
  });
});

describe('<Item />', () => {
  it('conforms to spec', () => {
    const Item: Item = {
      link: 'test',
      title: 'test post',
      description: 'this is a test Item',
      wip: false,
      date: '12/12/4',
      draft: false,
      emoji: '🚀'
    };

    expect(Item.link).toBe('test');
    expect(Item.wip).toBe(false);
  });
});
