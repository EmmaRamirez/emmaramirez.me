# Making a CLI Game with Elixir

Out of curiosity, I've currently been experimenting with the [Elixir programming language](https://elixir-lang.org/), and one of my goals to get a good feel for the language is building a tiny game in the command line. Why? Because it's fun!

> Note: This is being written about two weeks into learning Elixir, so I'm certain that some of the patterns & ideas here are not prime Elixir. I'll do my best to update this blog post over time as I learn more.

## Beginning the Brew

The first thing, [after installing Elixir itself](https://elixir-lang.org/getting-started/introduction.html) is creating the file in question.

```bash
touch game.ex
elixirc game.ex
```

`.ex` is the file extension for Elixir, and the `elixirc` command is how we run Elixir files (it stands for Elixir compile).

We begin our file by creating a module for our Game:

```elixir
defmodule Game do
    def start_game do
        IO.puts "Hello! Welcome to Elixirtopia. What would you like to do?"
    end
end
```

`defmodule` declares our module and `start_game` is a method that prints to the console. When you run `elixirc game.ex`, you should see "Hello! Welcome to Elixirtopia. What would you like to do?" printed to the screen.

