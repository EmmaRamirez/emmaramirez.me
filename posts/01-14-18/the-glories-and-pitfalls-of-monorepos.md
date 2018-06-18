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

```shell
|-- package.json
|-- lerna.json
|-- packages
|---- links
|---- stuff
```

Now run `lerna add lodash` to install lodash into each package. (If we ran `lerna add lodash --scope=links` for example, it would only install lodash in the links package).

## The Glories

There are some clear advantages that you'll quickly find when managing a monorepo.

For one, Lerna's `exec` command allows you to run a command _in each package_. For example,

```shell
lerna exec -- rm -rf ./node_modules
```

Will delete the `node_modules` in each package. A similar command is `run`, which is specifically for npm scripts.

```shell
lerna run build
```

Will run `npm run build` in each package, building them in parallel. (You can use the `--scope` argument previously discussed to only affect certain packages). Another example: let's say we wanted to run tests in each package, but we also wanted to update our jest snapshots. We can pass arguments the way you would with any npm script.

```shell
lerna run test -- -u
```

Another awesome thing about lerna is its `publish` command. I personally use this variation of it:

```shell
lerna publish --conventional-commits --yes
```

What this will do is publish each of your npm packages _and_ generate the appropriate npm version based off the commits (with the `--conventional-commits` flag) _and_ generate a changelog for each (using the `--changelog-preset` argument, which defaults to the [angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular#angular-convention) preset).

# The Pitfalls (?)

Monorepos do have some issues, but Lerna monorepos do have fewer issues than a regular monorepo. For example, publishing is a breeze and versioning, maintained via npm, is not singular or lost. Some of them are specific to Lerna.

If you're using yarn, you may face some issues regarding compatibility with lerna [now that it has moved back to npm](https://github.com/lerna/lerna/issues/1349), and using both in one monorepo _is an absolutely bad idea_ due to incompatibilities between `yarn.lock`, `package.json`, and the `pack` command.

At scale, lerna starts to [slow down](https://gist.github.com/nolanlawson/457cdb309c9ec5b39f0d420266a9faa4) significantly as the number of packages increases. Monorepos such as babel don't even use the `lerna run` command for this reason, as it cycles through each package, which can become cumbersome&mdash;at that point, it makes more sense to write a custom build script.

Another potential problem comes down to CI/CD, as it sometimes requires unecessarily complicated setups in the pipeline. While parallel pipelines in continuous deployment tools like CircleCI are useful for this, it's not an answer at scale. Like before, this sometimes requires custom build scripts and the like. 

And the last thing that I think is worth bringing up is the suggestion that monorepos hamper autonomy of teams, and that code sharing can introduce coupling. I've thought about this one the most, since it doesn't have a "clear" solution. It's philosophical. When code gets housed in the same repository, everyone can see all the code. But like an open space lined with desks, it often gets cramped, and that same transparency can make you feel like you're stepping on other people's toes. Sometimes you just want a closed room. 


## Further Reading
- [Atlassian: Monorepos in Git](https://developer.atlassian.com/blog/2015/10/monorepos-in-git/)
- [npm: Discussion on Subdirectories for Git installs](https://github.com/npm/npm/issues/2974)
- [Atlassian: Bolt build system](https://bitbucket.org/atlassian/atlaskit-mk-2/src)
- [Microsoft: Rush build system](https://github.com/Microsoft/web-build-tools/wiki/Rush)
- [Chen Long: Multirepo vs Monorepo](https://chengl.com/multirepo-vs-monorepo/)