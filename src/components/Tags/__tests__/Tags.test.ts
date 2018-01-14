import { Tag, Tags } from '..';

describe('<Tag />', () => {
    it('renders', () => {
        expect(Tag('tag')).toEqual(`<div class='tag'>tag</div>`);
    });
});

describe('<Tags />', () => {
    it('renders', () => {
        const wrapper = new Tags(['tag-a', 'tag-b']);
        expect(wrapper.render()).toBeDefined();
        expect(wrapper.render().match(/tag-a/g)).toBeDefined();
    });
});
