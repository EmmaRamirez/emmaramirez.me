const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');
const marked = require('marked');
const chalk = require('chalk');

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

const directories = getDirectories(path.resolve(__dirname, '../posts'));

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

const buildBlogPost = (data, fileName) => {
    return `
<html lang=${config.lang}>
    <head>
        <title>emmaramirez.me</title>
        <meta charset='utf-8'>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
        <link rel="icon" href="/favicon.ico" type="image/x-icon">
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400" rel="stylesheet">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">        
        <link href="../../code-theme.css" rel="stylesheet">
    </head>
    <body class='markdown-body'>
        <div id='markdown' style='color:white'>${marked(data)}</div>
        <div id='app'></div>
        <div id="disqus_thread"></div>
        <script>

        /**
        *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
        *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/
        /*
        var disqus_config = function () {
        this.page.url = 'http://emmaramirez.me/posts/${fileName}/';  // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = '${fileName}'; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };
        */
        (function() { // DON'T EDIT BELOW THIS LINE
        var d = document, s = d.createElement('script');
        s.src = 'https://emmaramirez-me.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
        })();
        </script>
        <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
                                    
        <script src='../../bundle.js'></script>
        <script src="../../rainbow-custom.min.js"></script><!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-79007755-1"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'UA-79007755-1');
        </script>        
    </body>
</html>`;
}

const convertToMarkdown = (data, file) => {
    const fileName = file.split('.')[0];
    ensureExists(`./docs/posts/${fileName}`, 0744, (err) => noop());
    const blogPost = buildBlogPost(data, fileName);
    fs.writeFile(`./docs/posts/${fileName}/index.html`, blogPost, err =>  {
        if (err) console.error(err);
        console.log(`Wrote ${chalk.yellow(fileName)} to posts ${ chalk.green('[' + new Date().toUTCString() + ']') }`);
    });
};