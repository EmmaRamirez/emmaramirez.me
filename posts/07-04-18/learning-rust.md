# Learning Rust

I've been writing Rust code for over a year now, and I am still squarely in the novice category. Which isn't a bad thing! But I'm certainly less of a novice and less mystified by Rust than I was a year ago. I come from a non-systems programming background, so most of this is going to relate back to that. I'll be going over some of the things that I've learned about Rust that make it as confusing as it is special.

For anyone getting started with Rust, it's heavy syntax is intimidating. I would liken it to a math course where everyone's using ∑, ∫, or ∴ (sum, integral, therefore), which is not very beginner friendly. Symbols exist for a reason: they help us communicate ideas more efficiently. But that same efficiency creates a barrier.

You can see just how [long of a list it is](https://doc.rust-lang.org/book/second-edition/appendix-02-operators.html?highlight=syntax#operators). If you have prior experience, some things are common like arrays [], generics <T>, and standard logical operators. Some, like @ (pattern binding), |x| (closure expression), or $ident (macro substitution) are probably less familiar.

## Borrowing and References

In Rust, there is a concept called _ownership_, which is the system through which memory is managed. In most languages there are two options

* [garbage collector](https://docs.microsoft.com/en-us/dotnet/standard/garbage-collection/fundamentals), which looks for used/unused memory (java)
* [explicit allocation](https://en.cppreference.com/w/cpp/language/raii), where the user sets the rules to free memory (C)

Rust takes a different direction with ownership, which is that memory is managed by rules of ownership. These work at compile time, so it doesn't slow down your program during runtime.

Ownership in Rust is difficult to wrap your hand around because it's unique to the language. The [Rust book, 2nd edition](https://doc.rust-lang.org/book/second-edition/ch04-01-what-is-ownership.html) summarizes the rules of ownership as:

> Each value in Rust has a variable that’s called its owner.

> There can only be one owner at a time.

> When the owner goes out of scope, the value will be dropped.

