# Piping Hot: A Rundown on the Pipeline Operator

## Context
Currently, the Pipeline operator is one of the more interesting proposals advancing through the TC39.

The operator `|>` is borrowed and inspired by several functional languages such as F#, Elm, and Elixir, and UNIX pipes as well. (The original syntax was `::`, which proved too controversial) According to the TC39 proposal

> It's a backwards-compatible way of streamlining chained function calls in a readable, functional manner, and provides a practical alternative to extending built-in prototypes.

which makes it very useful for short single-argument functions.

## Examples

In the simplest example, the pipeline operator turns `alert('Hello!')` into `'Hello!' |> alert`. This is not the best uage of the operator, as it doesn't aid the readability in any way. The better usage comes when you chain several functions together.

Take for example these functions:

```javascript
function add5 (number) {
    return number + 5;
}

function subtract3 (number) {
    return number - 3;
}

function multiplyBy10 (number) {
    return number * 10;
}
```

All pretty straightforward. Now we can do this:

```javascript
// ES6
const number = multiplyBy10(add5(subtract3(5)))
console.log(number) // 70

// Future
const number = 5
        |> subtract3
        |> add5
        |> multiplyBy10
```

This is slightly opinionated, but I think the pipeline operator aids in readability here. Note that the order goes by the function called _first_, which is especially useful since I know the f(g) versus g(f) can get confusing for particularly long-chained functions.

Let's do an example involving multiple arguments.

```javascript
function makeLowerCase(str) { return str.toLowerCase() }
function concat(strA, strB) { return strA + strB }
function writeSentence (subject, verb, object) {
    return `${subject} ${verb} a ${object}`
}

const apple = 'APPLE'

const sentence = apple
        |> makeLowerCase
        |> (s => concat('pine', s))
        |> (_ => writeSentence('I', 'ate', _))

console.log(sentence) // "I ate a pineapple"
```

While it seems a bit odd at first, we're just simple piping in arrow functions that handle the previous result from the preceeding pipe. When we took 'APPLE', we lowercased it, and then concatenated 'pine' with 'apple'. Hence, pineapple became the new argument for the last function, which wrote our sentence with pineapple as its subject.

You could also write the function as `writeSentence('I', 'ate', concat('pine', makeLowerCase(apple)))` though deciding between compactness or readability is up to you.

Depending on the [papp](https://github.com/mindeavor/es-papp) proposal, it may be able to write this:

```javascript
const sentence = apple
        |> makeLowerCase
        |> concat.papp('pine')
        |> writeSentence.papp('I', 'ate')
```

`papp` is used as a way to partially apply the function's parameters, leaving the rest to be used by the pipelines.

Async/Await usage also works nicely here. To borrow directly from the proposal's page:

```javascript
x |> await f
// is equivalent to
await f(x)
```

You can await the result of an async function and pass it to the next function, like so:

```javascript
const userAge = userId |> await fetchUsersById |> getAgeFromUser
// is equivalent to
const userAge = getAgeFromUser(await fetchUserById(userId))
```

A more complex example

```javascript
async function runOperationsOnFile () {
    fs.readFile('./post.txt')
        |> await
        |> file => file
                .split('\n')
                .map(fs.readFile)
        |> Promise.all
        |> await
        |> all => all.join('\n')
        |> console.log
}

// post.txt
fileA.txt
fileB.txt

//fileA
Hello 

//fileB
World!

// Result of runOperationsOnFile
Hello
World!
```

## Futher Reading

While the pipeline operator is currently a stage 1 (very experimental) feature, you can find other resources here:
- [TC39 Proposal](https://github.com/tc39/proposal-pipeline-operator)
- [mdn docs page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Pipeline_operator)
- [Fun Fun Function video](https://www.youtube.com/watch?v=dYQIkV2L-eg)
- [Babel Plugin](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-pipeline-operator)