
import Article = require('./article');

// Selectors
let content:HTMLElement = <HTMLElement>document.querySelector('.site-content');

let articles:Article[] = [
  {
    title: 'Hello',
    description: 'A description of this article.'
  },
  {
    title: 'Goodbye',
    description: 'Another article of sorts.'
  }
]
