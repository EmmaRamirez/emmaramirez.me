# Building the Nuzlocke Generator

> Note: This project is still in beta. Check it out [here](generator)

## Origins

In the Pokémon games, there's a ruleset called a [nuzlocke](https://bulbapedia.bulbagarden.net/wiki/Nuzlocke_Challenge), which is a set of self-enforced rules that make the game harder (aka you can only use the first Pokémon you see in an area, and all faints are considered deaths). And as weird as it probably sounds, there's an entire community built around nuzlocking and users enjoy posting updates of their nuzlockes, whether it's screenshots, stories, or comics. Another way of doing this is via a template, which is a run formatted around a psd (or paint) template.

I really enjoyed doing the latter, but I'm not very good at photoshop. So I used the creative tools I knew -- HTML and CSS. Here's some of the early stuff I made:

![early-nuzlocke](../../img/nuzlocke.png)

As I posted them, I got comments from people interested in the format, but I didn't have much to offer them -- it wasn't code I wrote for anyone else to see, and as I kept using the same code for different runs, it got hard to manage. I tried looking to see if there was anything out there that could make it easier to manage, but any tools that existed simply recorded logs, and didn't produce screenshots.

That's where I had the idea of the nuzlocke generator. At first, I tried reformattin g the HTML code I had an making it more dynamic, but this was a mess. So I turned to building an SPA with React & Typescript, and an http-server package called with [`npx`](https://github.com/zkat/npx), which proved to be a much cleaner combination.

The main flavor of state management for this was redux, with redux-saga and redux-persist in the mix. I'm a huge fan of both, as the former provides an easy mechanic for side-effects and the latter, a way to store user data locally. I considered making a server that would save all this info, but decided against it because I didn't really want to store user data if I could avoid it. Maybe I'm too afraid of GDPR. I may one day go back on this, because the idea of an Admin panel and site-wide stats strike me as interesting ideas that would be easier with a stronger backend.

## The Creation

And there it was! I tested it with a nuzlocke of my own (which was successful, by the way). After fixing the bugs I encountered during my run, I released a public beta.

![nuzlocke-generator](../../img/nuzlocke-generator.png)

After this, I got a great amount of user feedback, which was key to improving the implication. The feature I added soon after was an export and import format. Nuzlockes are all stored as JSON, so it's easy to serialize them into files that user can download, even without an actual backend. Alongside that, I continued adding more customization options and QoL improvements like autocomplete.

I've also worked on making the design more responsive since it's not uncommon you'll be playing and your phone is closer than your computer. (This is another case for server-side improvements, since it enables logins). Redux-persist is still very useful, however, and its migration feature has allowed someone who started their template at `0.0.1-beta` (like me) still work with current iterations.

The criticism I think has been most poignant is that sometimes layouts look too cookie-cutter. While custom CSS is an option, it's still clunky.

## The Future

Here's some of the work I've planned out:

Adding more layouts and customization. It's never easy to predict what layouts people will like the most. It migth be a good idea to direct users to take a look at the option before they start their runs to reduce cookie-cutterieness.

I'm working currently on converting the DOM elements that the generator produces into images. Right now, most users just take screenshots of their work. This is serviceable, but it's not good enough to me. There's some experimental FireFox APIs that can work here, as well as libraries like dom2image. I don't know how "social" I want the site to be, but a hall of fame does exist on the github repo.

The other thing is converting save files from Pokémon games into templates directly. I've actually near completed a [saveFile parser for Gen 1 Pokémon games](https://github.com/EmmaRamirez/pokemon-savefile-parser). As you get into later games, the data gets harder to parse, so that's a fun challenge. It's also pretty cool that, like other things, this doesn't require a backend with the [File API](https://developer.mozilla.org/en-US/docs/Web/API/File). The data is written to a binary format `.sav` that needs to be character-mapped into discernible stuff. Then, we have to gather the offsets and figure out the trainer's name, their team, and all other sorts of things. I also have to take into account that because nuzlockes aren't official, users "bury their dead" in different boxes, release them altogether, etc.

And the last thing I'm planning is a way to record the whole history of your nuzlocke. Redux makes this fairly user, the editor makes it hard since it's hard to tell when a user _intends_ something as a permanent change. For example, I could make a Squirtle as dead, and then later bring it back to life because it was a mistake. Is this something that should be recorded? Most apps that produce logs require confirmation. Here, I chose simplicity and snappiness. If I did implement this feature, it would require that a) users can modify their history and b) it doesn't pollute the history with changes like every keystroke into a species field.

That's essentially it! The app is currently hosted on heroku, and even one user would warm my heart, but 700 feels great for such a nice project. Feel free to reach out to me here or anywhere else if you have ideas or bugs. 


[generator]: https://nuzlocke-generator.herokuapp.com/