import { Tag, Tags } from '..';

describe('<Tag />', () => {
  it('renders', () => {
    expect(Tag({
      title: 'Typescript',
      index: 0,
      isHighlighted: false,
    })).toEqual(`<a href='/tags/Typescript' class='tag '><span class='tag-inner'>#Typescript</span></a>`);
  });
});

describe('<Tags />', () => {
  it('renders', () => {
    const wrapper = new Tags({ tags: ['tag-a', 'tag-b'] });
    expect(wrapper.render()).toBeDefined();
    expect(wrapper.render().match(/tag-a/g)).toBeDefined();
  });
});
