import { ElsewhereLinks, ElsewhereLink } from '..';

declare var describe: any;

describe('<ElsewhereLinks />', () => {
  const data: ElsewhereLink[] = [
    {
      link: 'jest',
      name: 'test'
    }
  ];

  it('renders', () => {
    const links = new ElsewhereLinks({ items: data });
    expect(typeof links.render()).toBe('string');
  });

  it('can contain data', () => {
    const links = new ElsewhereLinks({ items: data });
    const result = links.render();

    // Name has three references
    expect(result.match(/test/g)).toHaveLength(3);
    // Link has one
    expect(result.match(/jest/g)).toHaveLength(1);
  });

  it('can have options', () => {
    const links = new ElsewhereLinks({ items: data, options: { target: '_blank' }});
    expect((links.props.options as any).target).toBe('_blank');
  });
});
