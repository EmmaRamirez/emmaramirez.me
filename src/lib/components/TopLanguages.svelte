<script lang="ts">
    const languagesBase = [
        { name: 'svelte', percentage: (3/10)*100, color: 'var(--lang-svelte)' },
        { name: 'rust', percentage: (2/10)*100, color: 'var(--lang-rust)' },
        { name: 'elixir', percentage: (2/10)*100, color: 'var(--lang-elixir)' },
        {
            name: 'typescript',
            percentage: (2.5/10)*100, 
            color: 'var(--lang-typescript)'
        },
        {
            name: 'haskell',
            percentage: (.5/10)*100,
            color: 'var(--lang-haskell)'
        },
    ];

    let languages = $state(languagesBase);

    function setColor(color: string) {
        languages = languagesBase.map(lang => ({ ...lang, color: color }));
    }

    function resetColors() {
        languages = languagesBase;
    }
</script>

<div class="top-languages relative z-index-2">
    <div class="top-languages-title">top languages [by commit history]</div>
    <div
        class="top-languages-list rounded-sm gap-2 border border-[var(--liver-brown-500)] bg-[var(--blush-pink-500)] p-2 relative"
    >
    {#each languages as language, idx}
        
        <div on:mouseover={() => setColor(languagesBase[idx].color)} on:mouseleave={() => resetColors()} style="--color: {language.color};" class="top-languages-item flex items-center justify-between gap-2 p-1 m-1 rounded-sm z-2 relative text-white bg-[var(--liver-brown-500)] hover:bg-[var(--liver-brown-600)] cursor-pointer">
            <span>{language.name}</span>
            <span class="pill rounded-full  px-2">{language.percentage}%</span>
        </div>
        {/each}

        <div class="top-languages-layers absolute left-0 top-0 w-full h-full z-1">
        {#each languages as language}
            <div class="top-languages-layer w-full transition-all duration-300 ease-in-out" style="--color: {language.color}; --height: {language.percentage}%;"></div>
        {/each}
    </div>
    </div>

</div>

<style>
    .top-languages-layer {
        height: var(--height);
        background-color: var(--color);
        background-blend-mode: multiply;
        /* filter: blur(6px); */
        opacity: 0.5;        
    }
</style>