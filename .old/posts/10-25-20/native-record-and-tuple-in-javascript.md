# Native Record and Tuple Types in Javascript

> ⚠️ This is a stage 2 proposal and not yet a JS standard!

Javascript objects are generally mutable, and [mutability has risks](https://web.mit.edu/6.005/www/fa15/classes/09-immutability/) that become more noticeable in large-scale web applications. Luckily, the JS community has myriad solutions to this problem, such as Immutable.js or native features such as `Object.freeze`.

So what's that got to do with the title? Well, `Record` & `Tuple` are both new types that allow immutable native data structures in Javascript.

## The Record Type

In Typescript, the `Record` type is defined as follows

```typescript
type Record<K extends string, T> = {
    [P in K]: T;
}
```

and while they may seem very similar in shape, that's about all they have in common. Typescript `Record` is a utility mapped types, whereas Javascript `Record`s are a native type.

The Javascript definition of the `Record` type is nearly the same, with a key exception: **it can only contain primitives**. But just like the `Record` type defined above, it can be treated like an object.

```javascript
const record = #{
    dexNumber: 25,
    name: 'Pikachu',
    description: `Electric Mouse Pokemon
        Evolves into Raichu with a thunderstone`,
    types: #['electric']
}

// You can access keys like a regular JS object
console.log(record.dexNumber);

// You can use Object methods on the type
console.log(Object.keys(record));
```

That `#{ ... }` syntax is what defines a `Record` for us. What does that types declaration in our `Record` mean?

## The Tuple Type

If `#{ ... }` defines a `Record`, it might not shock you that `#[ ... ]` defines the `Tuple` type. In the same way `Record` can be treated like a Javascript object, `Tuple`s can be treated like Arrays.

```javascript
const tuple = #[0, 3];

// returns 3
console.log(tuple[1]);
```

## Putting it All Together

The main benefit of these new native types is _native immutability_, which allows for more performant JS code* (Immutable's toJS and fromJS can be computationally expensive) and allowing for a cleaner mental model. By cleaner mental model, I mean both not having to think "has this been mutated elsewhere?" and equality that is similar to that of primitives.

```javascript
#{a: 1, b: 2} === #{a: 1, b: 2} // true!!

// compared to a standard object
{a: 1, b: 2} === {a: 1, b: 2}; // false :(
```

Let's take a look at a larger example:

```typescript
// our record from earlier
const pokemon = {
    dexNumber: 25,
    name: 'Pikachu',
    description: `Electric Mouse Pokemon
        Evolves into Raichu with a thunderstone`,
    types: #['electric']
}

// spread the Record to create a new Record
const evolved = #{
    ...pokemon,
    name: 'Alolan Raichu',
    types: #['electric', 'psychic'],
}

// This results in a TypeError -- good
evolved.name = 'Kantonian Raichu';

// We can use Records as both map keys and map values
const pokedex = new Map();
map.set(evolved.name, evolved);

// Retrieve the types from our map and map the Tuple to strings
const displayTypes = map.get('Alolan Raichu').map(x => `${x} type`)).join(', ');

assert(displayTypes, 'electric type, psychic type');
```

As you can see, there's a lot we can do with `Record`s and `Tuple`s at our disposal, without some of the issues we run into when using third-party libraries.

Overall I'm optimistic about this proposal advancing through tc39's stages, especially as it reduces the scope & faults in design of previous native immutable type proposals.

\* Many of these performance optimizations will happen based on JS engine choices, but the proposal specifically avoids some cases (i.e. a branch path) that would inhibit performance-tuning.

## Further Reading

- [Record & Tuple Playground](https://rickbutton.github.io/record-tuple-playground)
- [Proposal details](https://github.com/tc39/proposal-record-tuple)
