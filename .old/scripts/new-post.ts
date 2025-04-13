#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');
const argv = require('yargs').argv;
const process = require('process');
const data = require('../src/data.json');
const config = require('../website.config');

const padZero = (s: string | number) => ('00' + s).slice(-2);

function createNewPost(
  title: string,
  date: string,
  emoji: string,
  tags: string,
  draft: boolean
) {
  const internalDate = new Date();
  const postTitle = title;
  const postTitleDashed = postTitle
    .toLowerCase()
    .replace(/\s/g, '-')
    .replace(/:/g, '');
  const postDate =
    date != null
      ? date
      : `${padZero(internalDate.getMonth() + 1)}-${padZero(
          internalDate.getDate()
        )}-${internalDate
          .getFullYear()
          .toString()
          .split('')
          .slice(-2)
          .join('')}`;
  const postData = data;
  const postDataArticles = postData.articles;
  const postTags = tags ? tags.split(',').map((s: string) => s.trim()) : [];
  const isDraft = draft || false;

  postDataArticles.unshift({
    link: '/posts/' + postTitleDashed,
    title: postTitle,
    date: postDate.replace(/-/g, '/'),
    emoji: emoji || '',
    tags: postTags,
    draft
  });

  data.articles = postDataArticles;

  if (!isDraft) {
    fs.mkdir(`./posts/${postDate}`, 0o777, (err: Error) => {
      // We ignore errors here, since a post can still be created
      fs.writeFile(
        `./posts/${postDate}/${postTitleDashed}.md`,
        `# ${postTitle}`,
        (err: Error) => {
          if (err) throw err;
          console.log(
            `Created directory ${chalk.green(postDate)} with post ${chalk.cyan(
              postTitle
            )}`
          );
        }
      );
    });
  } else {
    fs.writeFile(
      `${config.draftsDir}/${postTitleDashed}.md`,
      `# ${postTitle}`,
      (err: Error) => {
        if (err) throw err;
        console.log(
          `Created file ${chalk.cyan(postTitle)} in ${chalk.green(
            '__drafts__'
          )}`
        );
      }
    );
  }

  fs.writeFile(
    './src/data.json',
    JSON.stringify(data, null, 4),
    (err: Error) => {
      if (err) throw err;
      console.log(`Wrote post ${chalk.green(postTitle)} to data.json`);
    }
  );
}

if (argv.title != null) {
  createNewPost(argv.title, argv.date, argv.emoji, argv.tags, argv.draft);
} else {
  console.log(`
        ${chalk.red('ERROR: ')} Please provide a title for your new post.

        Run the command as ${chalk.yellow(
          'npm run create -- --title "Post Title" --tags string,string --draft <boolean> --emoji'
        )}
    `);
  process.exitCode = 1;
  process.exit();
}

export {};
