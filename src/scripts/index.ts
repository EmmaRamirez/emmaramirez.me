import { Article } from './interface.article';

let articles:Article[] = [
  {
    link: 'posts/article-title',
    title: 'This is an article',
    dateTime: '2016-05-31 08:39am',
    description: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.',
    tags: ['javascript', 'es6', 'css']
  },
  {
    link: 'posts/new-article',
    title: 'This is also an article',
    dateTime: '2016-05-31 08:39am',
    description: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.',
    tags: ['webpack', 'gulp', 'video games'],
    id: 1
  },
  {
    link: 'posts/article-title',
    title: 'Stylus: A Master Guide',
    dateTime: '2016-05-31 08:39am',
    description: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.',
    tags: ['stylus', 'css']
  },
  {
    link: 'posts/article-title',
    title: 'React & Typescript: A Match Made in JS Heaven',
    dateTime: '2016-05-31 08:39am',
    description: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.',
    tags: ['react', 'typescript']
  },
];


let settings:any = {
  displayDescription: true
};

function createArticle(article:Article):string {
  let tagString = '';
  if (typeof article.tags.length !== 'undefined') {
    for (let i = 0; i < article.tags.length; i++) {
      tagString += `<div class='site-article-tag' data-tag='${article.tags[i]}'>${article.tags[i]}</div>`;
    }
  }
  let articleTemplate = `
    <article class='site-article'>
      <header>
        <h3 class='site-article-heading'><a href='${article.link}'>${article.title}</a></h3>
        <span class='site-article-date-time'>${article.dateTime}</span>
        <div class='tag-container'>${tagString}</div>
      </header>
      <div class='content'>
        <p>${article.description}</p>
      </div>
    </article>`;
  return articleTemplate;
}

function appendArticles():void {
  let content = <HTMLElement>document.querySelector('.site-main');
  if (content !== null) {
    for (let i = 0; i < articles.length; i++) {
      content.innerHTML += createArticle(articles[i]);
    }
  }
}

function createSingleArticle(article:Article) {
  let tagString = '';
  if (typeof article.tags.length !== 'undefined') {
    for (let i = 0; i < article.tags.length; i++) {
      tagString += `<div class='site-article-tag' data-tag='${article.tags[i]}'>${article.tags[i]}</div>`;
    }
  }
  let articleTemplate = `
    <article>
      <header class='article-header'>
        <h1 class='article-heading'>${article.title}</h1>
        <h2 class='article-date-time'>${article.dateTime}</h2>
        <div class='tag-container'>${tagString}</div>
      </header>
      <main class='article-main'>

      </main>
      <footer class='article-footer'>

      </footer>
    </article>
  `;
  return articleTemplate;
}

function appendArticle() {
  let content = <HTMLElement>document.querySelector('.site-main-article');
  let article:Article;
  let id:any;
  if (content !== null) {
    id = content.getAttribute('data-id');
    for (let i = 0; i < articles.length; i++) {
      if (id === articles[i].id) {
        article = articles[i];
      }
    }
    content.innerHTML += createSingleArticle(article);
  }

  console.log(id);
}

function init():void {
  appendArticles();
  appendArticle();
}

init();
