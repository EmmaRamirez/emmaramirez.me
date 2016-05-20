import {Article} from './article';

let articles:Article[] = [
  {
    title: 'Article',
    link: 'article'
  }
];

function createArticles():void {
  let ul = document.createElement('ul');
  ul.className = "site-article-list";

  for (let i = 0; i < articles.length; ++i) {

    let li = document.createElement('li');
    li.className = "site-article-list-item";
    li.textContent = articles[i].title;
    ul.appendChild(li);
  }

  document.querySelector('.site-content').appendChild(ul);

}

function init():void {
  createArticles();
}

init();
