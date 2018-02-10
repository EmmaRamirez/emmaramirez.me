# The Glories and Pitfalls of Monorepos

"Monorepo" is one of those words you could break down -- Mono meaning one, and Repo meaning ~~rail~~ repository. Better phrased: you took a bunch of similar repos or npm packages and bundled them onto a single repo.

Now what?

Well, let's back up a little. Monorepos are an increasingly popular way to handle managing packages, especially as we continue to write (and consume) more atomic modules. A monorepo means you can centralize config, commits, releases, and anything you do in a normal repo in one place. Of course, it has all sorts of [pros and cons](https://github.com/babel/babel/blob/master/doc/design/monorepo.md). One of the biggest questions when it comes to monorepos is: do the pros outweigh the cons?

Well.... There's a pretty quick checklist you could make just to find that out:

- does the repo have multiple contributors?
- do the projects have similar release cycles?
- are the packages independent of each other?

If you answered yes to all three, consider yourself lucky and let's go! If not, keep thinking about your approaches&mdash;a monorepo might not be the best answer. Another additional question you might ask is "who consumes this?" While it's not a hard and fast rule, high-usage frameworks or libraries tend to be structured as monorepos (React, Angular, Meteor, etc).

## Setting It Up

Let's make a brand new project, called `links-and-stuff` in a directory somewhere, and then run the following

```shell
cd links-and-stuff
npm i -g lerna
lerna init --independent
lerna add links
```

This will create boilerplate with a `packages` folder. The `--independent` flag means we'll use separate versioning for each project. Your layout should look like this now

```
|-- package.json
|-- lerna.json
|-- packages
|---- links
|---- stuff
```

Now run `lerna add lodash` to install lodash into each package. (If we ran `lerna add lodash --scope=links` for example, it would only install lodash in the links package).

## The Glories

There are some clear advantages that you'll quickly find when managing a monorepo.

For one, Lerna's `exec` command allows you to 


## Further Reading
- [Atlassian: Monorepos in Git](https://developer.atlassian.com/blog/2015/10/monorepos-in-git/)
- [npm: Discussion on Subdirectories for Git installs](https://github.com/npm/npm/issues/2974)
- [Atlassian: Bolt build system](https://bitbucket.org/atlassian/atlaskit-mk-2/src)
- [Microsoft: Rush build system](https://github.com/Microsoft/web-build-tools/wiki/Rush)