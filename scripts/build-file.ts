const buildFile = ({
    config,
    keywords,
    description,
    markdown,
    fileName,
    data
}: {
    config: { lang: string, [x: string]: any },
    keywords: string,
    description: string,
    markdown: string,
    fileName: string,
    data: object,
}) => `
<html lang=${config.lang}>
    <head>
        <title>emmaramirez.me</title>
        <meta charset='utf-8'>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
        <link rel="icon" href="/favicon.ico" type="image/x-icon">
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap" rel="stylesheet">
        <link href='../../prism.css' rel='stylesheet' />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="keywords" content="${keywords}">
        <meta name="description" content="${description}">
        ${data ? `<script>window.data = ${JSON.stringify(data)}</script>` : ''}
    </head>
    <body class=${ markdown ? 'markdown-body' : ''}>
        <div id='markdown' style='display: none'>${markdown}</div>
        <div id='app'></div>
        <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
        <script src='../../bundle.js'></script>
        <script src='../../prism.js'></script>
        </script><!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-79007755-1"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'UA-79007755-1');
        </script>
    </body>
</html>`;

module.exports = buildFile;