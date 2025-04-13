# The Safe Navigation Operator

## A Billion Dollars

One thing about Javascript that's always irked me is dealing with `null` values. Sir Tony Hoare famously referred to its creation as the billion-dollar mistake. While the goal of the null reference was safety, it can create a lot of pitfalls, especially when checking through nested values in an object. Take for example a reference `article.author.name`. In Javascript, a conditional such as

```js
if (article.author.name) { ... }
```

If your code is `const article = { }`, the latter triggers an Uncaught TypeError, as the property name belongs to author which isn't defined. The solution is simple enough:

```js
if (article.author && article.author.name) { ... }

// or

if (article.author == null ? false : article.author.name)
```

But this is verbose, and can become problematic when you're dealing with primitives (i.e. name might be a string which is going to be coerced into true, but what about a number like 0? or an empty array, which becomes unfortunately `true`?).

Enter the safe navigation operator. This currently [Stage 1 proposal](https://github.com/tc39/proposal-optional-chaining) allows for code like this:

```js
if (article?.author?.name) { ... }
```

This is much cleaner. The `?` syntax essentially means "navigate to the next property, and if it's undefined, bail out." This can be arbitrarily chained (the safe navigation operator is also often called optional chaining or null propagation, or most dramatically, the existential operator). Since they can be nested, you can stack them like so:

```js
a?.b[3].c?.(x).d
```

That looks really complicated, so let's break it down.

`a` is an object that might contain...

`b` which is an array that might contain in its third index...

`c` which evaluates x if c is defined...

`d` which then calls d after the function is evaluated

## Using it Today

The safe navigation operator is available today in [Babel](https://github.com/babel/babel/pull/5813). It's part of [v7](https://github.com/babel/babel/tree/master/packages/babel-plugin-syntax-optional-chaining), though you'll have to npm install `@babel/plugin-syntax-optional-chaining`.

While there's been discussion of including this in Typescript (for over 3 years), it won't be included until it [reaches stage 3](https://github.com/Microsoft/TypeScript/issues/16). In the meantime, you could probably try pestering the tc39 committee as opposed to the Typescript team, but that's just my advice.

Ultimately, while the safe navigation operator would be a huge boon syntactically to the Javascript language, figuring out how to handle edge cases around syntax and effect are priorities for the ECMAScript community. Hopefully per Tony Hoare's advice we'll be able to save a couple billion.

I? Sure? Hope? So?