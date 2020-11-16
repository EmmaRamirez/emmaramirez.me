{

const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ensureExists = require('./ensure-exists');
const buildFile = require('./build-file');

const articles = require('../src/data.json').articles;
const config = require('../website.config');

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

directories.forEach((dir: string) =>
  fs.readdir(path.resolve(__dirname, dir), (err: any, files: string[]) => {
    readFiles(dir, files);
  })
);

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
  return require('markdown-it')().render(description).replace(/"/g, "'");
};

const buildBlogPost = (data: any, fileName: string) => {
  return buildFile({
    config,
    keywords: getTags(fileName),
    description: getDescription(data),
    markdown: require('markdown-it')().render(data),
    fileName
  });
};

const convertToMarkdown = (data: any, file: string) => {
  const fileName = file.split('.')[0];
  ensureExists(`./docs/posts/${fileName}`, 0o744, (err: Error) => noop());
  const blogPost = buildBlogPost(data, fileName);
  fs.writeFile(
    `./docs/posts/${fileName}/index.html`,
    blogPost,
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

}