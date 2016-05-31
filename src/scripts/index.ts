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
    link: 'posts/article-title',
    title: 'This is also an article',
    dateTime: '2016-05-31 08:39am',
    description: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.',
    tags: []
  },
  {
    link: 'posts/article-title',
    title: 'Stylus: A Master Guide',
    dateTime: '2016-05-31 08:39am',
    description: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.',
    tags: ['stylus', 'css']
  }
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
  for (let i = 0; i < articles.length; i++) {
    content.innerHTML += createArticle(articles[i]);
  }
}

function init():void {
  appendArticles();
}

init();
