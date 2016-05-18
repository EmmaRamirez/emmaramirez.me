import Article = require('./article');
//import articles = require('./articles');

let articles:Article[] = [
  {
    title: 'Intro to Typescript',
    description: 'A description of this article.',
    date: '2016-05-18',
    time: '08:44'
  },
  {
    title: 'Using Typescript with Webpack',
    description: 'Another article of sorts.',
    date: '2016-05-18',
    time: '08:44'
  },
  {
    title: 'Mastering Interfaces, Abstracts in Typescript',
    description: 'This will guide you into using interfaces and abstracts in Typescript.',
    date: '2016-05-18',
    time: '09:22'
  }
];

interface Element {
  content:HTMLElement;
}

let elements:Element = {
  content: <HTMLElement>document.querySelector('.site-content')
}

function createPosts():string {
  let posts:string = '';

  for (let i = 0; i < articles.length; ++i) {
    let link = 'articles/' + articles[i].title.toLowerCase().replace(/,/g, '').replace(/\s+/g, '-');
    posts += `
    <article class='site-article'>
      <h2 class='article-heading'>
        <a href='${link}'>${articles[i].title}</a>
      </h2>
      <h3 class='article-date'>
        Posted ${articles[i].date} on ${articles[i].time}am
      </h3>
      <p class='article-description'>
        ${articles[i].description}
      </p>
    </article>`;
  }
  return posts;
}

function addPosts():void {
  elements.content.innerHTML = createPosts();
}

function init():void {
  addPosts();
}

init();
