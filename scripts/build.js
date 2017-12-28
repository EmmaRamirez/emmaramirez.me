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

const ensureExists = (path, mask, cb) => {
    if (typeof mask === 'function') {
        cb = mask;
        mask = 0777;
    }
    fs.mkdir(path, mask, err => {
        if (err) {
            if (err.code == 'EEXIST') cb(null);
            else cb(err);
        } else {
            cb(null);
        }
    })
}

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

const buildBlogPost = data => {
    return `
        <html lang='en'>
            <head>
                <title>emmaramirez.me</title>
                <meta charset='utf-8'>
                <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
                <link rel="icon" href="/favicon.ico" type="image/x-icon">
                <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400" rel="stylesheet">
            </head>
            <body class='markdown-body'>
                <div id='markdown' style='color:white'>${marked(data)}</div>
                <div id='app'></div>
                <script src='../../bundle.js'></script>
            </body>
        </html>`;
}

const convertToMarkdown = (data, file) => {
    const fileName = file.split('.')[0];
    ensureExists(`./docs/posts/${fileName}`, 0744, (err) => noop());
    const blogPost = buildBlogPost(data);
    fs.writeFile(`./docs/posts/${fileName}/index.html`, blogPost, err =>  {
        if (err) console.error(err);
        console.log(`Converted ${file} to hml`);
    });
};