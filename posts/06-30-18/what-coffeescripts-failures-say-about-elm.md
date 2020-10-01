# What Coffeescript's Failures Say About Elm

## On Coffeescript
Coffeescript, a language that compiles to Javascript, [recently released version 2.0](https://coffeescript.org/announcing-coffeescript-2/), to little fanfare. There's a bevy of languages that compile to Javascript, but Coffeescript was, for quite a while, a popular one. Nowadays, [it's one of the most dreaded languages](https://insights.stackoverflow.com/survey/2018/#most-loved-dreaded-and-wanted) at 82.7%, falling behind only Cobol and Visual Basic 6. That's pretty impressive considering Cobol and VB6 are decades old and Coffeescript popped up 8 years ago.

From the start, [Coffeescript](https://github.com/jashkenas/coffeescript/issues/4288) [was](http://ryanflorence.com/2011/case-against-coffeescript/) [polarizing](http://walkercoderanger.com/blog/2014/03/coffeescript-isnt-the-answer/)&mdash;it was paired with Rails 4.0 as a default, so it's usage was often aimed at Ruby devs (and in fact, most Coffeescript code still being written is being written because of Rails). Coffeescript's big selling point was that _everything is an expression_, which sounds really cool until you get to:

```coffeescript
eat food for in foods unless poorAppetite
```

Which is already pretty hard to figure out, and gets harder to comprehend the longer the chain gets. This expressiveness and English-like syntax looks really beautiful, but paired with whitespace, quickly becomes hard to navigate. This permeates throughout the language, creating a mess of English-like symbols replacing logical symbols.

So we've established Coffeescript has a handful of issues, but what I think really did it in was its _disconnect from the modern Javascript ecosystem_, and in fact, I think this is a lesson for every language that transpiles to JS. For example, reading a [tutorial on how to share code between the browser and node](http://coffeescript-cookbook.github.io/chapters/syntax/code_reuse_on_client_and_server) has you transpiling your code into Javascript, then using a script tag in your HTML. Original coffeescript was a walled garden, only allowing you two use Javascript with a cumbersome backtick syntax, or global modules. Coffeescript 2.0 made some strides in terms of import/export, but Javascript has had this for years.

## On Elm
So why namedrop Elm? Well, I think this is an issue for every transpile-to-JS language. To reveal my bias, I think Typescript has done the best job navigating this issue, since valid JS is valid TS, and the `@types` libraries make compatibility easy.

I should probably also say that Elm is a great language with powerful features, and Elm is clear write when you enter the page that [interop matters](https://guide.elm-lang.org/interop/) and that powerful languages with no interop are just hobbies. So let's talk about interop and where I think Elm gets interop wrong.

Elm has a concept called [ports](https://guide.elm-lang.org/interop/javascript.html), which expose parts of an Elm program to Javascript. Ports work exclusively in the context of developer, rather than library, code. Elm's reasoning is as follows:

> Note: Port modules are not permitted in the package repository. Imagine you download an Elm package and it just doesn't work. You read the docs and discover you also need to get some JS code and hook it up properly. Lame. Bad experience. Now imagine if you had this risk with every package out there. It just would feel crappy, so we do not allow that.

Since Elm is statically and strictly typed, it makes sense that they need safeguards against the unclean Javascript code. But that's also a problem&mdash;it makes compatibility between JS libraries _your_ problem, and there's no guarantee it'll work, making refactors expensive. God forbid you decide to switch back to Javascript.

Elm, Purescript, and Dart all have their own packages managers, elm-package, pursuit, and pub, respectively. While that's fine, it also forgoes npm, which is the largest ecosystem of any language, and I think that's a critical mistake. Unless you have the infrastructure or niche use cases to justify those languages, or the time to implement your own libraries for the problems you might encounter.

To me, it comes off as hubris&mdash;in an attempt to guard their ecosystems, they skip out on compatibility with Javascript, which has evolved to be a great language with ES6+. Coffeescript had a lot of good ideas, and some like => syntax found their way into JS proper, and its syntax certainly wasn't enough ot sink it&mdash;it was its arrogant, casual detachment from the world of Javascript.