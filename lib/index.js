"use strict";
var baseUrl = 'emmaramirez.me';
var articles = [
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
var navLinks = [
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
function createNavLinks() {
    var ul = document.createElement('ul');
    ul.className = "site-nav-items";
    for (var i = 0; i < navLinks.length; ++i) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        li.className = "nav-item-link";
        a.className = "nav-item-link";
        a.textContent = navLinks[i].title;
        a.href = baseUrl + navLinks[i].link;
        li.appendChild(a);
        ul.appendChild(li);
    }
    document.querySelector('.site-nav').appendChild(ul);
}
function createArticles() {
    var ul = document.createElement('ul');
    ul.className = "site-article-list";
    for (var i = 0; i < articles.length; ++i) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        var dateTime = document.createElement('div');
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
function init() {
    createNavLinks();
    createArticles();
}
init();
//# sourceMappingURL=index.js.map