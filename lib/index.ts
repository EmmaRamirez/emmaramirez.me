import Article = require('./article');
//import Dot = require('./dot');

class Dot {
  x: number;
  y: number;

  create (ctx:any) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, .5, 0, Math.PI * 2, false);
    ctx.fill();
  }

  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }
}

let articles:Article[] = [
  {
    title: 'New Site Design!',
    description: 'A rundown of the new design of my website.',
    date: '2016-05-18',
    time: '10:37am'
  },
  {
    title: 'Intro to Typescript',
    description: 'A description of this article.',
    date: '2016-05-18',
    time: '08:47am'
  },
  {
    title: 'Using Typescript with Webpack',
    description: 'Another article of sorts.',
    date: '2016-05-18',
    time: '08:47am'
  },
  {
    title: 'Mastering Interfaces, Abstracts in Typescript',
    description: 'This will guide you into using interfaces and abstracts in Typescript.',
    date: '2016-05-18',
    time: '08:46am'
  }
];

interface Element {
  content: HTMLElement;
}

let elements:Element = {
  content: <HTMLElement>document.querySelector('.site-content')
}

function createPosts():string {
  let posts:string = '';

  for (let i = 0; i < articles.length; ++i) {
    let link = 'articles/' + articles[i].title.toLowerCase().replace(/!/g, '').replace(/,/g, '').replace(/\s+/g, '-');
    posts += `
    <article class='site-article'>
      <h2 class='article-heading'>
        <a href='${link}'>${articles[i].title}</a>
      </h2>
      <h3 class='article-date'>
        Posted on ${articles[i].date} at ${articles[i].time}
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
