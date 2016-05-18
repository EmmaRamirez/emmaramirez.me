"use strict";
//import Dot = require('./dot');
var Dot = (function () {
    function Dot(x, y) {
        this.x = x;
        this.y = y;
    }
    Dot.prototype.create = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, .5, 0, Math.PI * 2, false);
        ctx.fill();
    };
    return Dot;
}());
var articles = [
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
var elements = {
    content: document.querySelector('.site-content')
};
function createPosts() {
    var posts = '';
    for (var i = 0; i < articles.length; ++i) {
        var link = 'articles/' + articles[i].title.toLowerCase().replace(/!/g, '').replace(/,/g, '').replace(/\s+/g, '-');
        posts += "\n    <article class='site-article'>\n      <h2 class='article-heading'>\n        <a href='" + link + "'>" + articles[i].title + "</a>\n      </h2>\n      <h3 class='article-date'>\n        Posted on " + articles[i].date + " at " + articles[i].time + "\n      </h3>\n      <p class='article-description'>\n        " + articles[i].description + "\n      </p>\n    </article>";
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