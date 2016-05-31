"use strict";
var articles = [
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
var settings = {
    displayDescription: true
};
function createArticle(article) {
    var tagString = '';
    if (typeof article.tags.length !== 'undefined') {
        for (var i = 0; i < article.tags.length; i++) {
            tagString += "<div class='site-article-tag' data-tag='" + article.tags[i] + "'>" + article.tags[i] + "</div>";
        }
    }
    var articleTemplate = "\n    <article class='site-article'>\n      <header>\n        <h3 class='site-article-heading'><a href='" + article.link + "'>" + article.title + "</a></h3>\n        <span class='site-article-date-time'>" + article.dateTime + "</span>\n        <div class='tag-container'>" + tagString + "</div>\n      </header>\n      <div class='content'>\n        <p>" + article.description + "</p>\n      </div>\n    </article>";
    return articleTemplate;
}
function appendArticles() {
    var content = document.querySelector('.site-main');
    if (content !== null) {
        for (var i = 0; i < articles.length; i++) {
            content.innerHTML += createArticle(articles[i]);
        }
    }
}
function createSingleArticle(article) {
    var tagString = '';
    if (typeof article.tags.length !== 'undefined') {
        for (var i = 0; i < article.tags.length; i++) {
            tagString += "<div class='site-article-tag' data-tag='" + article.tags[i] + "'>" + article.tags[i] + "</div>";
        }
    }
    var articleTemplate = "\n    <article>\n      <header class='article-header'>\n        <h1 class='article-heading'>" + article.title + "</h1>\n        <h2 class='article-date-time'>" + article.dateTime + "</h2>\n        <div class='tag-container'>" + tagString + "</div>\n      </header>\n      <main class='article-main'>\n\n      </main>\n      <footer class='article-footer'>\n\n      </footer>\n    </article>\n  ";
    return articleTemplate;
}
function appendArticle() {
    var content = document.querySelector('.site-main-article');
    var article;
    var id;
    if (content !== null) {
        id = content.getAttribute('data-id');
        for (var i = 0; i < articles.length; i++) {
            if (id === articles[i].id) {
                article = articles[i];
            }
        }
        content.innerHTML += createSingleArticle(article);
    }
    console.log(id);
}
function init() {
    appendArticles();
    appendArticle();
}
init();
