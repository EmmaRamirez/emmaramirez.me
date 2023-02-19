{

const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ensureExists = require('./ensure-exists');
const buildFile = require('./build-file');

const articles = require('../src/data.json').articles;
const projects = require('../src/data.json').projects;
const links = require('../src/data.json').links;
const config = require('../website.config');

const store = {
  articles,
};

const noop = () => {};

const extension = (element: string) => {
  const extName = path.extname(element);
  return extName === '.md';
};

const isDirectory = (source: string) => fs.lstatSync(source).isDirectory();
const getDirectories = (source: string) =>
  fs
    .readdirSync(source)
    .map((name: string) => path.join(source, name))
    .filter(isDirectory);

const directories = getDirectories(path.resolve(__dirname, '../posts'));

const readFiles = (dir: string, files: string[]) =>
  files.filter(extension).forEach((file: string) => {
    const data = fs.readFileSync(path.join(dir, file), 'utf8');
    convertToMarkdown(data, file);
  });


const getTags = (filename: string) => {
  const article = articles.find(
    (f: any) => f.link === `./posts/${filename}`
  );
  if (article) return article.tags.join(', ');
  return 'no tags';
};

const getDescription = (data: any) => {
  const description =
    data
      .split('\n')
      .filter((s: string) => !s.includes('#'))
      .map((s: string) => s.trim())
      .filter((s: string) => s !== '')[0] + '...';
  // tslint:disable-next-line:quotemark
  return require('markdown-it')({
    html: true,
    typographer: true,
  }).render(description).replace(/"/g, "'");
};

const calculateReadTime = (d: string) => Math.ceil(d.split(' ').length / 200);

const buildBlogPost = (data: any, fileName: string) => (article: any) => {
  //writeToDataJson(data, article);

  return buildFile({
    config,
    keywords: getTags(fileName),
    description: getDescription(data),
    markdown: require('markdown-it')({
      html: true,
      typographer: true,
    }).render(data),
    readTime: calculateReadTime(data),
    fileName
  });
};

const writeToDataJson = (d: string, article: any) => {
  const id = (articles as any[]).indexOf(article);
  store.articles = [ ...articles.filter((a:any, idx: number) => idx !== id), { ...article, readTime: calculateReadTime(d) } ];
  console.log(store.articles);
}

const convertToMarkdown = (data: any, file: string) => {
  const fileName = file.split('.')[0];
  ensureExists(`./docs/posts/${fileName}`, 0o744, (err: Error) => noop());
  const blogPost = buildBlogPost(data, fileName);
  
  const article = articles.find(
    (f: any) => f.link === `/posts/${fileName}`
  );

  fs.writeFile(
    `./docs/posts/${fileName}/index.html`,
    blogPost(article),
    (err: Error) => {
      if (err) console.error(err);
      console.log(
        `Wrote ${chalk.yellow(fileName)} to posts ${chalk.green(
          `[${new Date().toUTCString()}]`
        )}`
      );
    }
  );
};

const writeToData = () => {
  const data = JSON.stringify({ articles: store.articles, projects, links }, null, 2);

  fs.writeFile(
    `./src/data.json`,
    data,
    (err: Error) => {
      if (err) console.error(err);
      console.log(`Wrote to data.json`)
    }
  )
}

directories.forEach((dir: string) => {
  fs.readdir(path.resolve(__dirname, dir), (err: any, files: string[]) => {
    readFiles(dir, files);
  });
});

// writeToData();

}