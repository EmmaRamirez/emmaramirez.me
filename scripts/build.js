const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

const config = require('../website.config');

// fse.remove(path.join(__dirname, '../docs/posts'), err => {
//     fs.mkdir(path.join(__dirname, '../docs/posts'), err => { if (err) throw err });
// });

const noop = () => {};

const extension = (element) => {
    const extName = path.extname(element);
    return extName === '.md';
};

const isDirectory = source => fs.lstatSync(source).isDirectory();
const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);

const directories = getDirectories(path.resolve(__dirname, '../src/posts'));

directories.forEach(dir => fs.readdir(path.resolve(__dirname, dir), (err, files) => {
    readFiles(dir, files);
}));

const readFiles = (dir, files) => files.filter(extension).forEach(file => {
    const data = fs.readFileSync(path.join(dir, file), 'utf8');
    convertToMarkdown(data, file);
});


marked.setOptions({
    gfm: true,
    tables: true,
    smartLists: true,
    smartypants: true
});

const convertToMarkdown = (data, file) => fs.writeFile(`./docs/posts/${file.split('.')[0]}.html`, (marked(data)), err =>  {
    if (err) console.error(err);
    console.log(`Converted ${file} to hml`);
});