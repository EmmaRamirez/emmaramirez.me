"use strict";

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJpbnRlcmZhY2UuYXJ0aWNsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

"use strict";
var articles = [
    // {
    //   link: 'posts/ten-things-you-may-not-know-about-npm',
    //   title: 'Ten Things You May Not Know About npm',
    //   dateTime: '2016-06-07 10:08:43am',
    //   description: '',
    //   tags: ['npm', 'javascrit'],
    //   draft: true
    // },
    {
        link: 'posts/build-tools-and-typescript',
        title: 'Build Tools & Typescript',
        dateTime: '2016-06-07 12:13:19am',
        description: '',
        tags: ['typescript', 'javascript', 'gulp', 'webpack', 'systemjs']
    },
    {
        link: 'posts/my-first-day-at-npmjs',
        title: 'My First Day at npmjs',
        dateTime: '2016-06-06 04:47:22pm',
        description: '',
        tags: ['npm', 'true ventures', 'personal']
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
    var articleTemplate = "\n    <article class='site-article'>\n      <header>\n        <h3 class='site-article-heading'><a href='" + article.link + "'>" + article.title + "</a></h3>\n        <span class='site-article-date-time'>" + article.dateTime + "</span>\n        <div class='tag-container'>" + tagString + "</div>\n      </header>\n      <div class='content'>\n        <p>" + (settings.displayDescription ? article.description : '') + "</p>\n      </div>\n    </article>";
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

//# sourceMappingURL=data:application/json;base64,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S0FBSyxxREFDWCxPQUFPLENBQUMsUUFBUSxrREFDbkIsU0FBUyw4SkFTM0MsQ0FBQztJQUNGLE1BQU0sQ0FBQyxlQUFlLENBQUM7QUFDekIsQ0FBQztBQUVEO0lBQ0UsSUFBSSxPQUFPLEdBQWdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUN4RSxJQUFJLE9BQWUsQ0FBQztJQUNwQixJQUFJLEVBQU0sQ0FBQztJQUNYLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLEVBQUUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDMUIsT0FBTyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDO1FBQ0gsQ0FBQztRQUNELE9BQU8sQ0FBQyxTQUFTLElBQUksbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEIsQ0FBQztBQUVEO0lBQ0UsY0FBYyxFQUFFLENBQUM7SUFDakIsYUFBYSxFQUFFLENBQUM7QUFDbEIsQ0FBQztBQUVELElBQUksRUFBRSxDQUFDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXJ0aWNsZSB9IGZyb20gJy4vaW50ZXJmYWNlLmFydGljbGUnO1xuXG5sZXQgYXJ0aWNsZXM6QXJ0aWNsZVtdID0gW1xuICAvLyB7XG4gIC8vICAgbGluazogJ3Bvc3RzL3Rlbi10aGluZ3MteW91LW1heS1ub3Qta25vdy1hYm91dC1ucG0nLFxuICAvLyAgIHRpdGxlOiAnVGVuIFRoaW5ncyBZb3UgTWF5IE5vdCBLbm93IEFib3V0IG5wbScsXG4gIC8vICAgZGF0ZVRpbWU6ICcyMDE2LTA2LTA3IDEwOjA4OjQzYW0nLFxuICAvLyAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgLy8gICB0YWdzOiBbJ25wbScsICdqYXZhc2NyaXQnXSxcbiAgLy8gICBkcmFmdDogdHJ1ZVxuICAvLyB9LFxuICB7XG4gICAgbGluazogJ3Bvc3RzL2J1aWxkLXRvb2xzLWFuZC10eXBlc2NyaXB0JyxcbiAgICB0aXRsZTogJ0J1aWxkIFRvb2xzICYgVHlwZXNjcmlwdCcsXG4gICAgZGF0ZVRpbWU6ICcyMDE2LTA2LTA3IDEyOjEzOjE5YW0nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICB0YWdzOiBbJ3R5cGVzY3JpcHQnLCAnamF2YXNjcmlwdCcsICdndWxwJywgJ3dlYnBhY2snLCAnc3lzdGVtanMnXSxcbiAgfSxcbiAge1xuICAgIGxpbms6ICdwb3N0cy9teS1maXJzdC1kYXktYXQtbnBtanMnLFxuICAgIHRpdGxlOiAnTXkgRmlyc3QgRGF5IGF0IG5wbWpzJyxcbiAgICBkYXRlVGltZTogJzIwMTYtMDYtMDYgMDQ6NDc6MjJwbScsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIHRhZ3M6IFsnbnBtJywgJ3RydWUgdmVudHVyZXMnLCAncGVyc29uYWwnXVxuICB9LFxuXTtcblxuXG5sZXQgc2V0dGluZ3M6YW55ID0ge1xuICBkaXNwbGF5RGVzY3JpcHRpb246IHRydWVcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZUFydGljbGUoYXJ0aWNsZTpBcnRpY2xlKTpzdHJpbmcge1xuICBsZXQgdGFnU3RyaW5nID0gJyc7XG4gIGlmICh0eXBlb2YgYXJ0aWNsZS50YWdzLmxlbmd0aCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFydGljbGUudGFncy5sZW5ndGg7IGkrKykge1xuICAgICAgdGFnU3RyaW5nICs9IGA8ZGl2IGNsYXNzPSdzaXRlLWFydGljbGUtdGFnJyBkYXRhLXRhZz0nJHthcnRpY2xlLnRhZ3NbaV19Jz4ke2FydGljbGUudGFnc1tpXX08L2Rpdj5gO1xuICAgIH1cbiAgfVxuXG4gIGxldCBhcnRpY2xlVGVtcGxhdGUgPSBgXG4gICAgPGFydGljbGUgY2xhc3M9J3NpdGUtYXJ0aWNsZSc+XG4gICAgICA8aGVhZGVyPlxuICAgICAgICA8aDMgY2xhc3M9J3NpdGUtYXJ0aWNsZS1oZWFkaW5nJz48YSBocmVmPScke2FydGljbGUubGlua30nPiR7YXJ0aWNsZS50aXRsZX08L2E+PC9oMz5cbiAgICAgICAgPHNwYW4gY2xhc3M9J3NpdGUtYXJ0aWNsZS1kYXRlLXRpbWUnPiR7YXJ0aWNsZS5kYXRlVGltZX08L3NwYW4+XG4gICAgICAgIDxkaXYgY2xhc3M9J3RhZy1jb250YWluZXInPiR7dGFnU3RyaW5nfTwvZGl2PlxuICAgICAgPC9oZWFkZXI+XG4gICAgICA8ZGl2IGNsYXNzPSdjb250ZW50Jz5cbiAgICAgICAgPHA+JHtzZXR0aW5ncy5kaXNwbGF5RGVzY3JpcHRpb24gPyBhcnRpY2xlLmRlc2NyaXB0aW9uIDogJyd9PC9wPlxuICAgICAgPC9kaXY+XG4gICAgPC9hcnRpY2xlPmA7XG5cblxuICByZXR1cm4gYXJ0aWNsZVRlbXBsYXRlO1xufVxuXG5mdW5jdGlvbiBhcHBlbmRBcnRpY2xlcygpOnZvaWQge1xuICBsZXQgY29udGVudCA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2l0ZS1tYWluJyk7XG4gIGlmIChjb250ZW50ICE9PSBudWxsKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29udGVudC5pbm5lckhUTUwgKz0gY3JlYXRlQXJ0aWNsZShhcnRpY2xlc1tpXSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNpbmdsZUFydGljbGUoYXJ0aWNsZTpBcnRpY2xlKSB7XG4gIGxldCB0YWdTdHJpbmcgPSAnJztcbiAgaWYgKHR5cGVvZiBhcnRpY2xlLnRhZ3MubGVuZ3RoICE9PSAndW5kZWZpbmVkJykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJ0aWNsZS50YWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0YWdTdHJpbmcgKz0gYDxkaXYgY2xhc3M9J3NpdGUtYXJ0aWNsZS10YWcnIGRhdGEtdGFnPScke2FydGljbGUudGFnc1tpXX0nPiR7YXJ0aWNsZS50YWdzW2ldfTwvZGl2PmA7XG4gICAgfVxuICB9XG4gIGxldCBhcnRpY2xlVGVtcGxhdGUgPSBgXG4gICAgPGFydGljbGU+XG4gICAgICA8aGVhZGVyIGNsYXNzPSdhcnRpY2xlLWhlYWRlcic+XG4gICAgICAgIDxoMSBjbGFzcz0nYXJ0aWNsZS1oZWFkaW5nJz4ke2FydGljbGUudGl0bGV9PC9oMT5cbiAgICAgICAgPGgyIGNsYXNzPSdhcnRpY2xlLWRhdGUtdGltZSc+JHthcnRpY2xlLmRhdGVUaW1lfTwvaDI+XG4gICAgICAgIDxkaXYgY2xhc3M9J3RhZy1jb250YWluZXInPiR7dGFnU3RyaW5nfTwvZGl2PlxuICAgICAgPC9oZWFkZXI+XG4gICAgICA8bWFpbiBjbGFzcz0nYXJ0aWNsZS1tYWluJz5cblxuICAgICAgPC9tYWluPlxuICAgICAgPGZvb3RlciBjbGFzcz0nYXJ0aWNsZS1mb290ZXInPlxuXG4gICAgICA8L2Zvb3Rlcj5cbiAgICA8L2FydGljbGU+XG4gIGA7XG4gIHJldHVybiBhcnRpY2xlVGVtcGxhdGU7XG59XG5cbmZ1bmN0aW9uIGFwcGVuZEFydGljbGUoKSB7XG4gIGxldCBjb250ZW50ID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaXRlLW1haW4tYXJ0aWNsZScpO1xuICBsZXQgYXJ0aWNsZTpBcnRpY2xlO1xuICBsZXQgaWQ6YW55O1xuICBpZiAoY29udGVudCAhPT0gbnVsbCkge1xuICAgIGlkID0gY29udGVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaWQgPT09IGFydGljbGVzW2ldLmlkKSB7XG4gICAgICAgIGFydGljbGUgPSBhcnRpY2xlc1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29udGVudC5pbm5lckhUTUwgKz0gY3JlYXRlU2luZ2xlQXJ0aWNsZShhcnRpY2xlKTtcbiAgfVxuXG4gIGNvbnNvbGUubG9nKGlkKTtcbn1cblxuZnVuY3Rpb24gaW5pdCgpOnZvaWQge1xuICBhcHBlbmRBcnRpY2xlcygpO1xuICBhcHBlbmRBcnRpY2xlKCk7XG59XG5cbmluaXQoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
