import { App } from 'components';
import { render, Nullable } from 'utils';

import './reset.styl';
import './global.styl';

const endpoint:Nullable<HTMLElement> = document.getElementById('app');
const app = new App();

render(app, endpoint, app => app.postRender());