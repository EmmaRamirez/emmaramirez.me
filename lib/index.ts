import {Article} from './article';
import {NavLink} from './nav';

let baseUrl = 'emmaramirez.me';

let articles:Article[] = [
  {
    title: 'Setting up Your Typescript Project with Webpack',
    link: 'article',
    date: '2016-05-20 08:51am'
  },
  {
    title: 'Introduction to Stylus',
    link: 'thing',
    date: '2016-05-20 08:58am'
  }
];

let navLinks:NavLink[] = [
  {
    title: 'Home',
    link: '/home'
  },
  {
    title: 'About',
    link: '/about'
  },
  {
    title: 'Nuzlockes',
    link: '/nuzlockes'
  },
  {
    title: 'Projects',
    link: '/projects'
  }
];

function createNavLinks():void {
  let ul = document.createElement('ul');
  ul.className = "site-nav-items";

  for (let i = 0; i < navLinks.length; ++i) {
    let li = document.createElement('li');
    let a = document.createElement('a');
    li.className = "nav-item-link";
    a.className = "nav-item-link";
    a.textContent = navLinks[i].title;
    a.href = baseUrl + navLinks[i].link;
    li.appendChild(a);
    ul.appendChild(li);
  }
  document.querySelector('.site-nav').appendChild(ul);
}

function createArticles():void {
  let ul = document.createElement('ul');
  ul.className = "site-article-list";

  for (let i = 0; i < articles.length; ++i) {
    let li = document.createElement('li');
    let a = document.createElement('a');
    let dateTime = document.createElement('div');
    li.className = "site-article-list-item";
    a.className = "site-article-list-link";
    a.textContent = articles[i].title;
    a.href = baseUrl + articles[i].link;
    dateTime.className = "site-article-date";
    dateTime.textContent = 'Written ' + articles[i].date;
    li.appendChild(a);
    li.appendChild(dateTime);
    ul.appendChild(li);
  }
  document.querySelector('.site-content-article-links').appendChild(ul);
}

function init():void {
  createNavLinks();
  createArticles();
}

init();
