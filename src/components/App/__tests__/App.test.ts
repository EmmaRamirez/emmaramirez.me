import { App } from '..';

declare var describe: any;

describe('App', () => {
    it('it renders', () => {
        const app = new App();
        expect(app).toBeDefined();
    });
});