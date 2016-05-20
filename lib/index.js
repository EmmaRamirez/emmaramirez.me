"use strict";
var articles = [
    {
        title: 'Article',
        link: 'article'
    }
];
function createArticles() {
    var ul = document.createElement('ul');
    ul.className = "site-article-list";
    for (var i = 0; i < articles.length; ++i) {
        var li = document.createElement('li');
        li.className = "site-article-list-item";
        li.textContent = articles[i].title;
        ul.appendChild(li);
    }
    document.querySelector('.site-content').appendChild(ul);
}
function init() {
    createArticles();
}
init();
//# sourceMappingURL=index.js.map