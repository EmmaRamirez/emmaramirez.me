# Programming Language Display Ideas

This note looks at ways to display the language mix shown in the current mock:

- Svelte: 30%
- TypeScript: 25%
- Rust: 20%
- Elixir: 20%
- Haskell: 5%

The current design is effectively a treemap: each language gets a rectangle sized by its percentage.

## What The Data Needs

This is a small part-to-whole dataset with five categories and one clear rank order. The display likely needs to do three things well:

- make the relative proportions obvious
- keep labels readable
- feel expressive enough for a personal site, not just a dashboard

## Research Notes

### 1. Horizontal bar chart

Best for:

- easy comparison
- quick scanning
- accessibility and readability

Why it works:

- Research and UX guidance consistently favor bars when people need to compare values precisely.
- The common baseline makes `30%` vs `25%` vs `20%` easier to read than area-based shapes.
- It also leaves room for long labels, icons, or short descriptions.

Trade-offs:

- less visually surprising than the current layout
- can feel generic unless the styling is strong

Good fit here:

- very strong, especially if the goal is "show my top languages clearly"

### 2. Treemap

Best for:

- compact layouts
- decorative, exploratory visuals
- showing part-to-whole at a glance

Why it works:

- It is visually distinctive and makes the language mix feel like a designed object rather than a plain chart.
- It uses space efficiently and can work nicely in a grid-heavy portfolio layout.

Trade-offs:

- Comparing areas is harder than comparing aligned bars.
- Small categories like `Haskell 5%` become awkward to label.
- Treemaps are generally better when there are many categories or hierarchy matters; neither is true here.

Good fit here:

- good as an artful homepage block
- weaker if the main goal is accurate comparison

### 3. Weighted Voronoi / organic cells

Best for:

- an expressive, generative layout
- keeping the "packed shape" feeling without rigid rectangles
- turning the language mix into a custom visual object

Why it works:

- A Voronoi layout can produce irregular cells that feel softer and more organic than a treemap.
- It suits a personal site well because it can feel more like an illustration than a chart.
- Labels can sit inside each region just like they do in the current mock.

Trade-offs:

- Standard Voronoi cells are driven by point position, not target percentages, so the areas will not naturally match the exact values.
- Hitting `30 / 25 / 20 / 20 / 5` requires approximation, iteration, or a weighted variant such as power diagrams.
- It is more implementation-heavy than bars or a treemap.

How we could approximate the target areas:

1. Start with one seed point per language inside a fixed bounding box.
2. Generate a Voronoi diagram from those points.
3. Measure each cell area and divide by the total box area to get the current percentage.
4. Compare the current percentages to the target percentages.
5. Move points for undersized cells outward into open space so they can claim more area.
6. Move points for oversized cells inward toward nearby competitors so they give area back.
7. Repeat until each cell is within an acceptable tolerance, like `+/- 1%`.

In practice, there are a few ways to do this:

- Manual art direction: drag points by hand until the cells feel right. This is fine for a one-off static composition.
- Iterative solver: after each recomputation, nudge each point based on its area error until the layout converges.
- Weighted Voronoi / power diagram: assign a weight to each point and solve for weights that better match the desired cell areas.

A useful mental model:

- position controls neighborhood and general shape
- weight controls influence and resulting area

That means the best workflow is often:

1. place points to get the composition you want
2. tune weights or positions to get close to the target percentages
3. freeze the final geometry as authored data

Good fit here:

- very strong if the goal is a custom, signature visual
- especially good if "mathematically perfect" matters less than "visually faithful to the percentages"

### 4. Segmented bar / 100% stacked bar

Best for:

- showing a clean part-to-whole relationship
- fitting into a tight horizontal space

Why it works:

- The full bar immediately communicates "these values sum to 100%."
- It is simpler than a treemap but still more visually designed than a plain list.
- It can work well with labels above or below the segments.

Trade-offs:

- Mid-bar segments are harder to compare precisely than standard bars.
- Small slices can create label collisions.

Good fit here:

- strong if the component is compact and mostly explanatory

### 5. Waffle chart

Best for:

- playful, friendly visuals
- emphasizing percentages as units of 100

Why it works:

- It makes percentages concrete by mapping them to squares.
- It can feel approachable and crafted, which suits a personal site.

Trade-offs:

- Research guidance usually treats waffle and unit charts as harder to compare precisely than bars.
- With only five categories, it can feel busier than the data deserves.
- The styling burden is higher if it needs to feel polished instead of gimmicky.

Good fit here:

- maybe, if the goal is charm over precision

### 6. Ranked cards / tiles

Best for:

- editorial presentation
- blending data with personality

Why it works:

- Each language can become a card with a percentage, short note, icon, or project link.
- This format works well if the content is about identity and experience, not just raw proportion.
- It can be responsive without feeling like a chart.

Trade-offs:

- The part-to-whole relationship becomes weaker.
- Without additional cues like progress bars, users may read it as a list instead of a distribution.

Good fit here:

- strong if the block should feel more like portfolio storytelling than analytics

## Recommendation

If the priority is clarity, use a **horizontal bar chart**.

If the priority is visual personality, use a **ranked card layout with small inline bars**.

If the priority is preserving the current bold blocky feel, keep the **treemap**, but treat it as a decorative hero element rather than the clearest representation of the data.

If the priority is a more custom art-directed composition, explore a **weighted Voronoi layout** and tune the cells until they land close to the target percentages.

## Suggested Direction For This Site

For this specific dataset, the best balance is probably:

1. a ranked vertical stack of language cards
2. each card showing the language name, percentage, and a slim bar
3. optional supporting metadata like "recent projects" or "what I reach for it for"

That keeps the information easy to compare while still feeling authored and personal.

## Sources

- [Datawrapper: A friendly guide to choosing a chart type](https://www.datawrapper.de/blog/chart-types-guide)
- [Nielsen Norman Group: Choosing Chart Types: Consider Context](https://www.nngroup.com/articles/choosing-chart-types/)
- [Storytelling with Data: Treemaps - pros & cons, plus alternatives](https://www.storytellingwithdata.com/blog/2018/6/5/an-alternative-to-treemaps)
- [Flourish: How to choose the right visualisation](https://flourish.studio/blog/choosing-the-right-visualisation)