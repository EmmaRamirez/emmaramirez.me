#!/usr/bin/env node

const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');
const marked = require('marked');
const chalk = require('chalk');
const argv = require('yargs').argv;
const process = require('process');
const data = require('../src/data.json');

const padZero = (s) => ('00' + s).slice(-2);

function createNewPost(title, date) {
    const internalDate = new Date();
    let postTitle = title;
    let postTitleDashed = postTitle.toLowerCase().replace(/\s/g, '-');
    let postDate = date != null ? date : `${padZero(internalDate.getMonth() + 1)}-${padZero(internalDate.getDate())}-${internalDate.getFullYear().toString().split('').slice(-2).join('')}`;
    let postData = data;
    let postDataArticles = postData.articles;

    postDataArticles.unshift({
        link: './posts/' + postTitleDashed,
        title: postTitle,
        date: postDate.replace(/-/g, '/')
    });

    data.articles = postDataArticles;

    fs.mkdir(`./posts/${postDate}`, 0777, err => {
        // We ignore errors here, since a post can still be created
        fs.writeFile(`./posts/${postDate}/${postTitleDashed}.md`, `# ${postTitle}`, err => {
            if (err) throw err;
            console.log(`Created directory ${chalk.green(postDate)} with post ${chalk.cyan(postTitle)}`);
        })
    })

    fs.writeFile('./src/data.json', JSON.stringify(data, null, 4), err => {
        if (err) throw err;
        console.log(`Wrote post ${chalk.green(postTitle)} to data.json`);
    });
}

if (argv.title != null) {
    createNewPost(argv.title, argv.date);
} else {
    console.log(`
        ${chalk.red('ERROR: ')} Please provide a title for your new post.

        Run the command as ${chalk.yellow('npm run create -- --title "Post Title"')}
    `);
    process.exitCode = 1;
    process.exit();
}