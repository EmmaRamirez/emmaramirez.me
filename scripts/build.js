const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

fse.remove(path.join(__dirname, '../public/posts'), err => {
    fs.mkdir(path.join(__dirname, '../public/posts'), err => { if (err) throw err });
});

const files = fs.readdir(path.join(__dirname, '../src/posts'), (err, files) => {
    readFiles(files);
});

const readFiles = files => files.forEach(file => fs.readFile(path.join(__dirname, '../src/posts/test.md'), { encoding: 'utf8' }, (err, data) => {
    if (err) throw err;
    convertToMarkdown(data, file);
}));

marked.setOptions({
    gfm: true,
    tables: true,
    smartLists: true,
    smartypants: true
});

const convertToMarkdown = (data, file) => fs.writeFile(path.join(__dirname, `../public/posts/${file.split('.')[0]}.html`), (marked(data)), err =>  {
    if (err) throw err;
    console.log(`Converted ${file} to hml`);
});