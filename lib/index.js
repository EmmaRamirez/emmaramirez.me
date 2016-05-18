"use strict";
//import articles = require('./articles');
var articles = [
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
var content = document.querySelector('.site-content');
function createPosts() {
    var posts = '';
    for (var i = 0; i < articles.length; ++i) {
        posts += "\n    <article class='site-article'>\n      <h2 class='article-heading'>\n        <a href='#'>" + articles[i].title + "</a>\n      </h2>\n      <p class='article-description'>\n        " + articles[i].description + "\n      </p>\n    </article>";
    }
    return posts;
}
function addPosts() {
    content.innerHTML = createPosts();
}
addPosts();
//# sourceMappingURL=index.js.map