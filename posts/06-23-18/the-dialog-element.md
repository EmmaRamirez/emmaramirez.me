# The Dialog Element

<script src="https://cdn.jsdelivr.net/gh/ireade/caniuse-embed/caniuse-embed.min.js"></script>

The [HTML5.2](https://www.w3.org/TR/html52/) spec includes a couple of minor updates, but the one I'm most excited about is the [`<dialog>`](https://www.w3.org/TR/html52/interactive-elements.html#the-dialog-element) element.

Dialogs exist everywhere on the web&mdash;and every website implements it in their own way. But the biggest issue with this is that websites don't always implement it in accessible ways, and [implementing accessible modal dialogs](https://bitsofco.de/accessible-modal-dialog/) isn't always easy. So a native dialog element sounds like a good thing&mdash;we get accessibility out of the box, it's custmoizable, and requires minimal Javascript unlike, say, one of the [many react dialogs](https://www.npmjs.com/search?q=react%20dialog) out there.

Currently, dialog is supported on the following browsers, most noticeably Chrome:

<p class="ciu_embed" data-feature="dialog" data-periods="future_2,future_1,current,past_1,past_2" data-accessible-colours="false">
  <a href="http://caniuse.com/#feat=dialog">Can I Use dialog?</a> Data on support for the dialog feature across the major browsers from caniuse.com.
</p>

So how do we implement it? The Dialog element follows a pretty simple format.

```html
<dialog id="dialog">
    <header>
        <h1>Dialog Title</h1>
    </header>
    <p>Lorem ipsum dolor amet man bun irony letterpress ugh vexillologist.
    Cronut synth craft beer, dreamcatcher organic adaptogen venmo activated 
    charcoal listicle trust fund food truck. Fixie pok pok skateboard franzen 
    food truck tattooed tousled raw denim shoreditch freegan adaptogen la croix 
    selfies prism. Pinterest actually meggings pickled, four dollar toast tilde 
    kinfolk art party iceland organic chicharrones tote bag 90's. Taiyaki vice 
    kale chips hammock mixtape tote bag XOXO authentic poutine vegan. Banh mi 
    hexagon hell of try-hard small batch intelligentsia affogato enamel pin 
    seitan readymade YOLO. Woke bicycle rights deep v, umami squid salvia 
    cronut knausgaard.</p>
    <button class="close">Close Dialog</button>
</dialog>
```
If you were to omit the `open` attribute, the dialog would be closed. You can have pretty much any time of content you want within a dialog element. User agent styles applied to the dialog element have so far seemed pretty light. Of course it wouldn't be useful if it wasn't interactive! For this, the dialog element has a `.show()` and `.close()` method.

<p data-height="440" data-theme-id="109" data-slug-hash="MXLbaL" data-default-tab="result" data-user="boltaway" data-embed-version="2" data-pen-title="MXLbaL" class="codepen">See the Pen <a href="https://codepen.io/boltaway/pen/MXLbaL/">MXLbaL</a> by emma (<a href="https://codepen.io/boltaway">@boltaway</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

If you want to copy this code, you'll also these event handlers:

```javascript
window.addEventListener('DOMContentLoaded', () => {
    const dialog = document.getElementById('dialog');
    console.log(dialog);
    document.getElementById('open').addEventListener('click', () => {
        dialog.show();
    });
    Array.from(document.querySelectorAll('.close'))
        .forEach(f => { /* f is one button element */
            f.addEventListener('click', () => {
                dialog.close();
            })
        });
});
```
You'll likely notice a couple things about this dialog:
- You can't use `esc` to exit the dialog. It's unclear if this might be implemented by other browsers, or if this is something developers should implement
- The dialog is very plain. It has very minimal initial CSS. This includes things such as positioning.
- It automatically focuses on the buttons in the dialog, which is great for accessibility

That's largley it on the dialog element. It's in infancy still, so hopefully we'll see it mature more as it becomes adopted by other browsers.


## Further Reading
- [Chrome Tracking For Dialog](https://bugs.chromium.org/p/chromium/issues/detail?id=677562)