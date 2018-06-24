import { App, Header } from 'components';
import { render, Nullable } from 'utils';

const data = require('data.json');

import './reset.styl';
import './global.styl';

const endpoint: Nullable<HTMLElement> = document.getElementById('app');
const app = new App({ Header: new Header(), data });

function selectText() {
  const preTags = document.querySelectorAll('pre');
  preTags.forEach(item =>
    item.addEventListener('click', () =>
      window.getSelection().selectAllChildren(item)
    )
  );
}

render(app, endpoint, app => app.postRender());

selectText();