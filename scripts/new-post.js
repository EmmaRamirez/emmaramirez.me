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
    let postDate = date != null ? date : `${padZero(internalDate.getMonth() + 1)}-${padZero(internalDate.getDate())}-${internalDate.getFullYear().toString().split('').slice(-2).join('')}`;
    let postData = data;
    let postDataArticles = postData.articles;


    postDataArticles.unshift({
        link: './posts/' + postTitle.toLowerCase().replace(/\s/g, '-'),
        title: postTitle,
        date: postDate.replace(/-/g, '/')
    });

    data.articles = postDataArticles;

    fs.writeFile('../src/data.json', JSON.stringify(data), err => {
        if (err) throw err;
        console.log(`Wrote post ${chalk.green(postTitle)} to data.json`);
    });
    
    console.log(postDataArticles);
    

    
}

if (argv.title != null) {
    createNewPost(argv.title, argv.date);
} else {
    process.exitCode = 1;
    process.exit();
}