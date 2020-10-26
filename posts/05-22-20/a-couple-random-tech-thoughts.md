# A Couple Random Tech Thoughts

I haven't had much time or energy to write articles, so I wanted to dump a couple things that I've been thinking lately.

## Hooks really are better.

When hooks first came onto the scene, I was a bit confused (and more than anything else, mystified) and sort of ignored them for a few months. When I had to start a new project, I decided to try hooks again&mdash;voila!&mdash;maybe they just hadn't clicked.

- Don't be afraid to de-couple hooks from your components! Function components are meant to have a better separation of concerns, and hooks help with that goal.
- `useEffect` for any side-effects. I know that's sort of obvious, but when I started using hooks, I would end up with these infinitely repeating API calls or console.logs being done thousands of times. `useEffect` runs both on every render and every update, so using an effect dependency is an easy optimization to make. For example

    ```typescript
    useEffect(() => {
        console.log(blogPostCount);
    }, [blogPostCount])
    ```

This will only run when blogPostCount is changed, just like a strict `componentWillUpdate` check.

- Getting people to adopt hooks is not always easy. Despite the learning curve, we also just like sticking to what we already know&mdash;classes! And most of us transitioned away from `React.createClass()` to classes so it's a double-whammy. Hooks are also incompatible with *a lot* of existing React architecture, and this is absolutely my biggest frustration with them.
- Or rather, converting classes into Function components is a pain in the butt and there's a cognitive overload to recalling which React methods map to which Hooks. Check out this [guide](https://reactjs.org/docs/hooks-faq.html#adoption-strategy) for more info.

## Dogfooding is a good idea, actually

I'm realizing this more and more as I've worked with the [nuzlocke-generator](https://nuzlocke-generator.com) and ocassionally breaking things. The more I actually do my own nuzlockes and record them using my own tool, the more errors I catch! Wow, who knew using your own software was a good idea!
  - Of course, what I really mean by this is workflows that aren't common when developing. For example, you can import a `nuzlocke.json` file in the application, but when I'm testing I'm usually just creating a new one and working through that...
  - Whereas users are often using `nuzlocke.json` files that might be multiple versions old. This is especially brittle because all data is stored locally, so there's no such things as db migrations. Redux-persist migrations are used to catch these, but can on ocassion miss, especially if it's a multiple-version mismatch.

## Frustrated users are the most important ones.

Speaking of the nuzlocke-generator, it went down for a bit. By which I mean like 2 weeks. And I got to hear a great deal of complaints from users when that happened, BUT it also cemented to me how important the tool I was. Before it went down (thanks Heroku), I had sort of convinced myself that people wouldn't care a great deal. No one was mean or anything (thank God), but it was sort of heart-warming hearing from users that they use the tool all the time, in all different sorts of channels. Good software is reliable, full stop. After getting it back up, I've been working a lot harder on resilience-testing and being more responsive to pushing up hotfixes (i.e. never making the mistaking of pushing a big update and then just going to sleep). Instead, after pushing updates, I monitor social media and rollbar.

In other notes, I'll keep trying to make more time to write blog posts, although I've spent a lot of time recovering from my facial feminization surgery working on updates for my open source tools.