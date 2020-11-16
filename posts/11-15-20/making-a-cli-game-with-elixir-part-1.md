# Making a CLI Game with Elixir Part I

Out of curiosity, I've currently been experimenting with the [Elixir programming language](https://elixir-lang.org/), and one of my goals to get a good feel for the language is building a tiny game in the command line. Why? Because it's fun!

> Note: This is being written about two weeks into learning Elixir, so I'm certain that some of the patterns & ideas here are not prime Elixir. I'll do my best to update this blog post over time as I learn more.

## Beginning the Brew

The first thing, [after installing Elixir itself](https://elixir-lang.org/getting-started/introduction.html) is creating an Elxir file*.

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

Game.start_game
```

`defmodule` declares our module and `start_game` is a method that prints to the console. When you run `elixirc game.ex`, you should see "Hello! Welcome to Elixirtopia. What would you like to do?" printed to the screen.

## Managing State

Functional programming relies on the pure functions in order to achieve predictability and elegance. But like most programming languages, Elixir offers a way of handling side-effects, that is code that dispatches actions rather than just returning values, through procceses, in this case `Agent`s.

Let's refactor our code a bit to look more like this

```elixir
defmodule Game do
    use Agent

    def start_game do
        IO.puts "Hello! Welcome to Elixirtopia. What would you like to do?"
    end

    def create_player do
        Agent.start_link(fn -> %{
            :attack => 10,
            :current_hp => 10,
            :max_hp => 10,
            :name => "",
        } end, name: :player)
    end
end
```

Okay, so that's quite a bit going on there. First, we declare `use Agent`, in the same way you would any import. Then, our `create_player` function starts the process that creates our player -- we also name it `:player` for convenience later on. For this game, we declare a couple of attributes in a Map (`%{}`) (equivalent to a Python dict or a Javascript object), chiefly attack, current_hp, max_hp, and name.

Let's add these two additional functions. For brevity's sake, presume that any additional functions are int he body of our `Game` module.

```elixir
def get_player do
    Agent.get(:player, & &1)
do

def update_player(key, value) do
    Agent.get_and_update(:player, fn (x) -> {x | %{x | key => value }} end)
end
```

Don't worry too much about any confusing syntax here, just know that `get_player` retrieves our `:player` from state and `update_player` updates the Map with the appropriate map and key.

## Sequencing the Game

Now, let's modify our `start_game` function

```elixir
def start_game do
    Game.create_player
    answer = IO.gets """
        Hello! Welcome to Elixirtopia. What would you like to do?
        [1] Explore
        [2 / any other key] Quit
    """
    answer_parsed = Integer.parse answer
    number = elem(answer_parsed, 0)

    cond do
        number == 1 -> explore
        number == 2 -> quit
        number == :error -> quit
        true -> quit
    end
end
```

Let's run through all of what this means

`Game.create_player` calls our Agent to manage our player state

`IO.gets` prints out a prompt with a multiline `"""` string

`elem(answer_parsed, 0)` after our answer has been parsed, much like in Rust, we need to unwrap the resulting value. Elixir will either return our value or an `:error`

`cond do` declares a condition and we match based on that; the `true` declaration at the end will match any condition we give it. You may intuit that because we only have 2 options&mdash;explore or quit&mdash;we only need `number == 1 -> explore` and `true -> quit` and you'd be absolutely right!

`explore` and `quit` are functions we haven't written yet!

We'll walk through the exploration and more in the next segment.

## Further Reading & Footnotes

\* `Mix` is generally what you would use to initiate a real-world project, but this is more in the alley of "contrived example."

Additional Reading
- [Explanation of & Operator](https://dockyard.com/blog/2016/08/05/understand-capture-operator-in-elixir)