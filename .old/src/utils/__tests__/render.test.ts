import { render, noop } from '..';

describe('render()', () => {
  it('behaves as expected', () => {
    const component = {
      render() {
        return 'Hello Test';
      }
    };
    const endpoint: HTMLElement = {
      innerHTML: ''
    } as HTMLElement;
    const callback = () => {};

    // returns nothing
    expect(render(component, endpoint, callback)).toBeUndefined();
    expect(render(component, null, callback)).toBeUndefined();
    expect(endpoint.innerHTML).toBe('Hello Test');
  });
});

describe('noop()', () => {
  it('behaves as expected', () => {
    expect(noop()).toBeUndefined();
  });
});
