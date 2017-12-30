import { State } from 'state';
import { Header } from 'components/Header';
import { Item, List } from 'components/List';
import { ElsewhereLinks } from 'components/ElsewhereLinks';

const data = require('data.json');

export class App {
  public Header: Header;
  public theme: '☀️' | '🌙' | string;

  constructor(public data?: any) {
    this.theme = localStorage.getItem('theme') || '🌙';
    this.Header = new Header((event: Event, element: HTMLElement) => {
      const targetNode = document.body;
      if (element.textContent === '🌙') {
        this.theme = '☀️';
        element.textContent = '☀️';
        if (targetNode) targetNode.className = 'dark';
        localStorage.setItem('theme', '🌙');
      } else {
        this.theme = '🌙';
        element.textContent = '🌙';
        if (targetNode) targetNode.className = 'light';
        localStorage.setItem('theme', '☀️');
      }
    }, this.theme);
    this.data = data || { articles: [], projects: [], links: [] };
  }

  public appBody(): string {
    if (document.body.className === 'markdown-body') {
      const md = document.getElementById('markdown');
      const markdown = (md ? md : { innerHTML: false }).innerHTML;
      (md ? md : { innerHTML: false }).innerHTML = '';
      return markdown as string;
    }
    return `
      <div class='posts'>
          <h2>Writing</h2>
          ${new List(this.data.articles).render()}
          <h2>Projects</h2>
          ${new List(this.data.projects, {
            target: '_blank'
          }).render()}
          <img style='display: block; margin: 3rem auto' src='./palms.webp' />
          <br />
          <h2>Elsewhere</h2>
          ${new ElsewhereLinks(this.data.links, {
            target: '_blank'
          }).render()}
          <div class='monospace'>Bitcoin: 16mM8fFqLsAFZ9J6v1Efr3Ba8mT18RuZLW</div>
          <div class='monospace'>Ethereum: 0x67cee0981f84Cc86A0eC7491e2d19cd8476d0A42</div>

          <div class='stats'>
            <p><a href="https://travis-ci.org/EmmaRamirez/emmaramirez.me" rel="nofollow"><img src="https://camo.githubusercontent.com/b70123a10e32ce6a5fbc9095092238fee4e78e0f/68747470733a2f2f696d672e736869656c64732e696f2f7472617669732f456d6d6152616d6972657a2f656d6d6172616d6972657a2e6d652e7376673f7374796c653d666c61742d737175617265" alt="Build Status" data-canonical-src="https://img.shields.io/travis/EmmaRamirez/emmaramirez.me.svg?style=flat-square" style="max-width:100%;"></a>
            <a href="/EmmaRamirez/emmaramirez.me/blob/master"><img src="https://camo.githubusercontent.com/447f3afa7024326905ca2c2876b9bc5e6cc9b09e/68747470733a2f2f696d672e736869656c64732e696f2f636f766572616c6c732f6769746875622f456d6d6152616d6972657a2f656d6d6172616d6972657a2e6d652f6d61737465722e7376673f7374796c653d666c61742d737175617265" alt="Coveralls github branch" data-canonical-src="https://img.shields.io/coveralls/github/EmmaRamirez/emmaramirez.me/master.svg?style=flat-square" style="max-width:100%;"></a>
            <a href="https://github.com/EmmaRamirez/emmaramirez.me/releases"><img src="https://camo.githubusercontent.com/269a97dd4464cbcdf95a7997795577f8aa258a20/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f72656c656173652f656d6d6172616d6972657a2f656d6d6172616d6972657a2e6d652e7376673f7374796c653d666c61742d737175617265" alt="npm" data-canonical-src="https://img.shields.io/github/release/emmaramirez/emmaramirez.me.svg?style=flat-square" style="max-width:100%;"></a>
            <a href="https://github.com/EmmaRamirez/emmaramirez.me/blob/master/LICENSE.md"><img src="https://camo.githubusercontent.com/71b19f8e18d3b94461ee83e974f54504feb2ed8a/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542532304c6963656e73652d626c75652e7376673f7374796c653d666c61742d737175617265" alt="license" data-canonical-src="https://img.shields.io/badge/license-MIT%20License-blue.svg?style=flat-square" style="max-width:100%;"></a>
          </div>
      </div>`;
  }

  public render() {
    return `
            <div class='app'>
                ${this.Header.render()}
                <div class='blog-post'>
                  ${this.appBody()}
                </div>
            </div>
        `;
  }

  public postRender() {
    this.Header.postRender();
  }
}
