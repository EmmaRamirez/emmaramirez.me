import { Header } from 'components/Header';
import { List } from 'components/List';
import { Component } from 'utils';

const data = (window as any).data || require('data.json');

export interface AppProps {
  Header: Header;
  data: {
    articles?: any[];
    projects?: any[];
    links?: any[];
  };
  forceMarkdownRender?: boolean;
}

export class App extends Component<AppProps> {
  public articles: List;
  public projects: List;
  public header: Header;
  public forceMarkdownRender = false;

  constructor(props: AppProps) {
    super(props);
    this.header = new Header();
    this.articles = new List({
      items: (this.props as any).data.articles || []
    });
    this.projects = new List({
      items: (this.props as any).data.projects || [],
      options: {
        target: '_blank'
      },
      type: 'projects'
    });
    this.forceMarkdownRender = props.forceMarkdownRender || false;
  }

  public appBody(): string {
    const isTagsPage = window.location.pathname.includes('tags');
    const windowPathArray = window.location.pathname.split('/');
    const tag = windowPathArray[windowPathArray.length - 2];

    if (document.body.className === 'markdown-body' && window.location.pathname.includes('posts') || this.forceMarkdownRender) {
      const md = document.getElementById('markdown');
      const markdown = (md ? md : { innerHTML: false }).innerHTML;
      
      return markdown as string;
    }

    return `
      <div class='posts'>
          ${isTagsPage ? `<h2 class="big-tag">${tag}</h2>` : ''}
          ${isTagsPage ? '' : `<h2 class="writing-title">Writing</h2>`}
          ${this.articles.render()}
          ${isTagsPage ? '' : '<h2>Projects</h2>'}
          ${this.projects.render()}
          <h2 class='palm-tree'>🌴</h2>
      </div>`;
  }

  public render() {
    return `
            <div class='app'>
                <div class='blog-post'>
                  ${this.header.render()}
                  ${this.appBody()}
                </div>
            </div>
        `;
  }

  public postRender() {
    this.articles.postRender();
    this.header.postRender();
    this.projects.postRender();
    const md = document.getElementById('markdown');
    if (md) { md.innerHTML = ''; }
    const readTimeRaw = document.querySelector('#app')?.getAttribute('data-read-time');
    const readTime = readTimeRaw == null ? null : Number.parseInt(readTimeRaw as string);
    const readTimeFormatted = readTime != null ? '📖 ' + (readTime + ' minute read') : null;
    const readTimeElement = document.createElement('span');
    const h1 = document.querySelector('h1');
    readTimeElement.classList.add('read-time');
    readTimeElement.innerHTML = readTimeFormatted ?? '';
    h1?.prepend(readTimeElement);
  }
}
