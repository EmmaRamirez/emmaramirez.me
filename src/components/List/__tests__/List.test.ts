import { List } from '..';

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