import { App, Header } from 'components';
import { render, Nullable } from 'utils';

const data = (window as any).data || require('data.json');

import './reset.scss';
import './global.scss';

const endpoint: Nullable<HTMLElement> = document.getElementById('app');
const app = new App({ Header: new Header(), data });

function selectText() {
  const preTags = document.querySelectorAll('pre');
  preTags.forEach(item =>
    item.addEventListener('click', () =>
      window && window.getSelection()?.selectAllChildren(item)
    )
  );
}

render(app, endpoint, app => app.postRender());

selectText();
