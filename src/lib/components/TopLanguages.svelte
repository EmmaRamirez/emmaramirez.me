<script lang="ts">
	import { cn } from "$lib/utils";

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
    <div
        class="top-languages-list rounded-sm gap-2 border-2 border-[var(--liver-brown-500)]  p-2 relative"
    >
        <div class="top-languages-title flex items-center justify-between mb-2"><span>top languages</span><span>by<select>
            <option value="commit-history">commit history</option>
        </select></span></div>

        <div class="grid grid-cols-2 gap-2">
        {#each languages as language, idx} 
        <div style="--color: {language.color};" class={cn("top-languages-item flex items-center justify-between  p-1 m-1 z-2 relative bg-transparent border-[var(--color)]  cursor-pointer border-2 rounded-lg ")}>
            <span>{language.name}</span>
            <span class="pill rounded-full  px-2">{language.percentage}%</span>
        </div>
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
    }
</style>