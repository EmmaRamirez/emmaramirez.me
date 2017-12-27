import { App } from 'components';
import { render, Nullable } from 'utils';

const data = require('data.json');

import './reset.styl';
import './global.styl';

const endpoint:Nullable<HTMLElement> = document.getElementById('app');
const app = new App(data);

render(app, endpoint, app => app.postRender());