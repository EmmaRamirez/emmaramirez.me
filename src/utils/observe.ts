export const observe = () => {
    return (obj:any, callback:Function) => {
        const obs = new MutationObserver((mutations, observer) => {
            if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
                callback();
            }
        });

        obs.observe(obj, { childList: true, subtree: true });
    };
};