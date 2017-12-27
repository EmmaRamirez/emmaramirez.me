import { App } from "..";

const data = require("data.json");

declare var describe: any;

describe("App", () => {
  it("renders", () => {
    const app = new App();
    expect(app.render()).toBeDefined();
    expect(typeof app.render()).toBe("string");
    expect(app.theme).toEqual("🌙");
  });

  it("can contain data", () => {
    const app1 = new App();
    const app2 = new App(data);
    expect(app1.data.projects.length).toBe(0);
    expect(app2.data.projects.length).toBe(data.projects.length);
  });

  it("contains a Header", () => {
    const app = new App(data);
    expect(app.Header).toBeDefined();
    expect(typeof app.Header.render()).toBe("string");
  });
});
