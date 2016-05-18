"use strict";
//import articles = require('./articles');
var articles = [
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
var elements = {
    content: document.querySelector('.site-content')
};
function createPosts() {
    var posts = '';
    for (var i = 0; i < articles.length; ++i) {
        var link = 'articles/' + articles[i].title.toLowerCase().replace(/,/g, '').replace(/\s+/g, '-');
        posts += "\n    <article class='site-article'>\n      <h2 class='article-heading'>\n        <a href='" + link + "'>" + articles[i].title + "</a>\n      </h2>\n      <h3 class='article-date'>\n        Posted " + articles[i].date + " on " + articles[i].time + "am\n      </h3>\n      <p class='article-description'>\n        " + articles[i].description + "\n      </p>\n    </article>";
    }
    return posts;
}
function addPosts() {
    elements.content.innerHTML = createPosts();
}
function init() {
    addPosts();
}
init();
//# sourceMappingURL=index.js.map