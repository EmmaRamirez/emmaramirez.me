import { Header } from "..";

declare var describe: any;

describe("Header", () => {
  it("renders", () => {
    const header = new Header((e, el) => null);
    expect(header).toBeDefined();
    expect(typeof header.render()).toBeDefined();
    expect(header.render()).toEqual(
      `<header class='header'><span class='site-title'>🍍 emmaramirez</span><span class='site-style-switcher'>🌙</span></header>`
    );
  });

  it("has a postRender", () => {
    const header = new Header((e, el) => ({ e, el }));
    expect(header.postRender).toBeDefined();
  });
});
