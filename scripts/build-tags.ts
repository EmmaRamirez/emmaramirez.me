
{
    const fse = require('fs-extra');
    const fs = require('fs');
    const path = require('path');
    const marked = require('marked');
    const chalk = require('chalk');
    const buildFile = require('./build-file');

    const data = require('../src/data.json');
    const config = require('../website.config');

    const ensureExists = require('./ensure-exists');

    const getTags = () => {
        const p = data.projects.map((t: any) => t.tags);
        const a = data.articles.map((t: any) => t.tags);
        const allTags = [...p, ...a].reduce((p, c) => [...p, ...c], []);
        // @ts-ignore: downLevel iteration
        const uniqueTags = [...new Set(allTags)];
        return uniqueTags.map(tag => (tag as string).toString().replace(/\s/g, '-'));
    };

    const createDataFromTag = (tag: string) => {
      const unFormattedTag = tag.replace(/-/g, ' ');
      const projects = data.projects.filter((f: any) => f.tags.includes(unFormattedTag));
      const articles = data.articles.filter((f: any) => f.tags.includes(unFormattedTag));
      return {
        projects,
        articles,
      };
    };

    ensureExists(`./docs/tags`, 0o744, (err: Error) => {});

    console.log(`${chalk.blue(`Tags: ${getTags().join(', ')}`)}`);

    getTags().forEach((tag, key) => {
        ensureExists(`./docs/tags/${tag}`, 0o744, (err: Error) => {
          if (err) throw err;
          try {
            fs.writeFileSync(
              `./docs/tags/${tag}/index.html`,
              buildFile({
                config,
                keywords: tag,
                description: `Auto-generated tag page for ${tag}`,
                markdown: false,
                data: createDataFromTag(tag),
                filename: `${tag}`
              }));

            console.log(
              `Wrote ${chalk.yellow(tag)} to tags ${chalk.green(
                `[${new Date().toUTCString()}]`
              )}`
            );
          } catch (e) {
            console.error(e);
          }
        });

    });

}