import { Tag, Tags } from '..';

describe('<Tag />', () => {
  it('renders', () => {
    expect(Tag('tag')).toEqual(`<a href='/tags/tag' class='tag'>tag</a>`);
  });
});

describe('<Tags />', () => {
  it('renders', () => {
    const wrapper = new Tags({ tags: ['tag-a', 'tag-b'] });
    expect(wrapper.render()).toBeDefined();
    expect(wrapper.render().match(/tag-a/g)).toBeDefined();
  });
});
