
import Article = require('./article');
//import articles = require('./articles');

let articles:Article[] = [
  {
    title: 'Intro to Typescript',
    description: 'A description of this article.'
  },
  {
    title: 'Using Typescript with Webpack',
    description: 'Another article of sorts.'
  },
  {
    title: 'Mastering Interfaces, Abstracts in Typescript',
    description: 'This will guide you into using interfaces and abstracts in Typescript.'
  }
];


// Selectors
let content:HTMLElement = <HTMLElement>document.querySelector('.site-content');

function createPosts():string {
  let posts:string = '';

  for (let i = 0; i < articles.length; ++i) {
    let link = 'articles/' + articles[i].title.toLowerCase().replace(/,/g, '').replace(/\s+/g, '-');
    posts += `
    <article class='site-article'>
      <h2 class='article-heading'>
        <a href='${link}'>${articles[i].title}</a>
      </h2>
      <p class='article-description'>
        ${articles[i].description}
      </p>
    </article>`;
  }
  return posts;
}

function addPosts():void {
  content.innerHTML = createPosts();
}

function init():void {
  addPosts();
}

init();
