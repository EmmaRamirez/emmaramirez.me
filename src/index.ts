import { App } from 'components';
import { render, Nullable } from 'utils';

import './reset.styl';
import './global.styl';

const endpoint:Nullable<HTMLElement> = document.getElementById('app');

render(`${new App().render()}`, endpoint);