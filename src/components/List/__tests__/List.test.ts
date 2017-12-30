import { Item, List, ListOptions } from '..';

const data = require('data.json');

declare var describe: any;

describe('List', () => {
  it('renders', () => {
    const list = new List(data.projects);
    expect(list.render()).toBeDefined();
  });

  it('can contain data', () => {
    const list = new List(data.projects);
    expect(list.items.length).toBe(data.projects.length);
  });
});

describe('Item', () => {
  it('conforms to spec', () => {
    const Item:Item = {
      link: 'test',
      title: 'test post',
      description: 'this is a test Item',
      wip: false
    };

    expect(Item.link).toBe('test');
    expect(Item.wip).toBe(false);
  });
});