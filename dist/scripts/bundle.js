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
    // {
    //   link: 'posts/getting-running-with-typescript',
    //   title: 'Getting Running with Typescript',
    //   dateTime: '2016-06-07 12:13:19am',
    //   description: '',
    //   tags: ['typescript', 'javascript'],
    //   draft: true
    // },
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

//# sourceMappingURL=data:application/json;base64,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QUM7QUFDekIsQ0FBQztBQUVEO0lBQ0UsSUFBSSxPQUFPLEdBQWdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUN4RSxJQUFJLE9BQWUsQ0FBQztJQUNwQixJQUFJLEVBQU0sQ0FBQztJQUNYLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLEVBQUUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDMUIsT0FBTyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDO1FBQ0gsQ0FBQztRQUNELE9BQU8sQ0FBQyxTQUFTLElBQUksbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEIsQ0FBQztBQUVEO0lBQ0UsY0FBYyxFQUFFLENBQUM7SUFDakIsYUFBYSxFQUFFLENBQUM7QUFDbEIsQ0FBQztBQUVELElBQUksRUFBRSxDQUFDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXJ0aWNsZSB9IGZyb20gJy4vaW50ZXJmYWNlLmFydGljbGUnO1xuXG5sZXQgYXJ0aWNsZXM6QXJ0aWNsZVtdID0gW1xuICAvLyB7XG4gIC8vICAgbGluazogJ3Bvc3RzL3Rlbi10aGluZ3MteW91LW1heS1ub3Qta25vdy1hYm91dC1ucG0nLFxuICAvLyAgIHRpdGxlOiAnVGVuIFRoaW5ncyBZb3UgTWF5IE5vdCBLbm93IEFib3V0IG5wbScsXG4gIC8vICAgZGF0ZVRpbWU6ICcyMDE2LTA2LTA3IDEwOjA4OjQzYW0nLFxuICAvLyAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgLy8gICB0YWdzOiBbJ25wbScsICdqYXZhc2NyaXQnXSxcbiAgLy8gICBkcmFmdDogdHJ1ZVxuICAvLyB9LFxuICAvLyB7XG4gIC8vICAgbGluazogJ3Bvc3RzL2dldHRpbmctcnVubmluZy13aXRoLXR5cGVzY3JpcHQnLFxuICAvLyAgIHRpdGxlOiAnR2V0dGluZyBSdW5uaW5nIHdpdGggVHlwZXNjcmlwdCcsXG4gIC8vICAgZGF0ZVRpbWU6ICcyMDE2LTA2LTA3IDEyOjEzOjE5YW0nLFxuICAvLyAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgLy8gICB0YWdzOiBbJ3R5cGVzY3JpcHQnLCAnamF2YXNjcmlwdCddLFxuICAvLyAgIGRyYWZ0OiB0cnVlXG4gIC8vIH0sXG4gIHtcbiAgICBsaW5rOiAncG9zdHMvbXktZmlyc3QtZGF5LWF0LW5wbWpzJyxcbiAgICB0aXRsZTogJ015IEZpcnN0IERheSBhdCBucG1qcycsXG4gICAgZGF0ZVRpbWU6ICcyMDE2LTA2LTA2IDA0OjQ3OjIycG0nLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICB0YWdzOiBbJ25wbScsICd0cnVlIHZlbnR1cmVzJywgJ3BlcnNvbmFsJ11cbiAgfSxcbl07XG5cblxubGV0IHNldHRpbmdzOmFueSA9IHtcbiAgZGlzcGxheURlc2NyaXB0aW9uOiB0cnVlXG59O1xuXG5mdW5jdGlvbiBjcmVhdGVBcnRpY2xlKGFydGljbGU6QXJ0aWNsZSk6c3RyaW5nIHtcbiAgbGV0IHRhZ1N0cmluZyA9ICcnO1xuICBpZiAodHlwZW9mIGFydGljbGUudGFncy5sZW5ndGggIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnRpY2xlLnRhZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRhZ1N0cmluZyArPSBgPGRpdiBjbGFzcz0nc2l0ZS1hcnRpY2xlLXRhZycgZGF0YS10YWc9JyR7YXJ0aWNsZS50YWdzW2ldfSc+JHthcnRpY2xlLnRhZ3NbaV19PC9kaXY+YDtcbiAgICB9XG4gIH1cblxuICBsZXQgYXJ0aWNsZVRlbXBsYXRlID0gYFxuICAgIDxhcnRpY2xlIGNsYXNzPSdzaXRlLWFydGljbGUnPlxuICAgICAgPGhlYWRlcj5cbiAgICAgICAgPGgzIGNsYXNzPSdzaXRlLWFydGljbGUtaGVhZGluZyc+PGEgaHJlZj0nJHthcnRpY2xlLmxpbmt9Jz4ke2FydGljbGUudGl0bGV9PC9hPjwvaDM+XG4gICAgICAgIDxzcGFuIGNsYXNzPSdzaXRlLWFydGljbGUtZGF0ZS10aW1lJz4ke2FydGljbGUuZGF0ZVRpbWV9PC9zcGFuPlxuICAgICAgICA8ZGl2IGNsYXNzPSd0YWctY29udGFpbmVyJz4ke3RhZ1N0cmluZ308L2Rpdj5cbiAgICAgIDwvaGVhZGVyPlxuICAgICAgPGRpdiBjbGFzcz0nY29udGVudCc+XG4gICAgICAgIDxwPiR7c2V0dGluZ3MuZGlzcGxheURlc2NyaXB0aW9uID8gYXJ0aWNsZS5kZXNjcmlwdGlvbiA6ICcnfTwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvYXJ0aWNsZT5gO1xuXG5cbiAgcmV0dXJuIGFydGljbGVUZW1wbGF0ZTtcbn1cblxuZnVuY3Rpb24gYXBwZW5kQXJ0aWNsZXMoKTp2b2lkIHtcbiAgbGV0IGNvbnRlbnQgPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNpdGUtbWFpbicpO1xuICBpZiAoY29udGVudCAhPT0gbnVsbCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJ0aWNsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnRlbnQuaW5uZXJIVE1MICs9IGNyZWF0ZUFydGljbGUoYXJ0aWNsZXNbaV0pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTaW5nbGVBcnRpY2xlKGFydGljbGU6QXJ0aWNsZSkge1xuICBsZXQgdGFnU3RyaW5nID0gJyc7XG4gIGlmICh0eXBlb2YgYXJ0aWNsZS50YWdzLmxlbmd0aCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFydGljbGUudGFncy5sZW5ndGg7IGkrKykge1xuICAgICAgdGFnU3RyaW5nICs9IGA8ZGl2IGNsYXNzPSdzaXRlLWFydGljbGUtdGFnJyBkYXRhLXRhZz0nJHthcnRpY2xlLnRhZ3NbaV19Jz4ke2FydGljbGUudGFnc1tpXX08L2Rpdj5gO1xuICAgIH1cbiAgfVxuICBsZXQgYXJ0aWNsZVRlbXBsYXRlID0gYFxuICAgIDxhcnRpY2xlPlxuICAgICAgPGhlYWRlciBjbGFzcz0nYXJ0aWNsZS1oZWFkZXInPlxuICAgICAgICA8aDEgY2xhc3M9J2FydGljbGUtaGVhZGluZyc+JHthcnRpY2xlLnRpdGxlfTwvaDE+XG4gICAgICAgIDxoMiBjbGFzcz0nYXJ0aWNsZS1kYXRlLXRpbWUnPiR7YXJ0aWNsZS5kYXRlVGltZX08L2gyPlxuICAgICAgICA8ZGl2IGNsYXNzPSd0YWctY29udGFpbmVyJz4ke3RhZ1N0cmluZ308L2Rpdj5cbiAgICAgIDwvaGVhZGVyPlxuICAgICAgPG1haW4gY2xhc3M9J2FydGljbGUtbWFpbic+XG5cbiAgICAgIDwvbWFpbj5cbiAgICAgIDxmb290ZXIgY2xhc3M9J2FydGljbGUtZm9vdGVyJz5cblxuICAgICAgPC9mb290ZXI+XG4gICAgPC9hcnRpY2xlPlxuICBgO1xuICByZXR1cm4gYXJ0aWNsZVRlbXBsYXRlO1xufVxuXG5mdW5jdGlvbiBhcHBlbmRBcnRpY2xlKCkge1xuICBsZXQgY29udGVudCA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2l0ZS1tYWluLWFydGljbGUnKTtcbiAgbGV0IGFydGljbGU6QXJ0aWNsZTtcbiAgbGV0IGlkOmFueTtcbiAgaWYgKGNvbnRlbnQgIT09IG51bGwpIHtcbiAgICBpZCA9IGNvbnRlbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGlkID09PSBhcnRpY2xlc1tpXS5pZCkge1xuICAgICAgICBhcnRpY2xlID0gYXJ0aWNsZXNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnRlbnQuaW5uZXJIVE1MICs9IGNyZWF0ZVNpbmdsZUFydGljbGUoYXJ0aWNsZSk7XG4gIH1cblxuICBjb25zb2xlLmxvZyhpZCk7XG59XG5cbmZ1bmN0aW9uIGluaXQoKTp2b2lkIHtcbiAgYXBwZW5kQXJ0aWNsZXMoKTtcbiAgYXBwZW5kQXJ0aWNsZSgpO1xufVxuXG5pbml0KCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
