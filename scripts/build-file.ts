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
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400" rel="stylesheet">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="../../code-theme.css" rel="stylesheet">
        <meta name="keywords" content="${keywords}">
        <meta name="description" content="${description}">
        <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <script>
        (adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "ca-pub-5802352571182119",
            enable_page_level_ads: true
        });
        </script>
        ${data ? `<script>window.data = ${JSON.stringify(data)}</script>` : ''}
    </head>
    <body class=${ markdown ? 'markdown-body' : ''}>
        <div id='markdown' style='color:white'>${markdown}</div>
        <div id='app'></div>
        <div id="disqus_thread"></div>
        <script>
        var disqus_config = function () {
            this.page.url = 'http://emmaramirez.me/posts/${fileName}/';  // Replace PAGE_URL with your page's canonical URL variable
            this.page.identifier = '${fileName}'; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };
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

module.exports = buildFile;