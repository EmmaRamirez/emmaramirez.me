<script lang="ts">
    let interests = [
        {
            name: 'developer tooling',
            description: 'I love building tools for developers to use.',
        },
        {
            name: 'artificial intelligence',
            description: 'I love using generative ai to create things.',
        },
        {
            name: 'networking',
            description: 'software defined networking, aerospace satellite communications',
        },
        {
            name: 'telehealth',
            description: 'democratizing healthcare, telemedicine, and legislative repsponses to telehealth',
        },
        {
            name: 'open source',
            description: 'I love open source software and the community that surrounds it.',
        },
        {
            name: 'FIRE finance',
            description: 'I love the idea of financial independence and early retirement.',
        },
    ];
</script>


<div class="hobbies col-span-2 h-48 self-center mb-4 border-4 border-[var(--liver-brown-500)] ml-[-4vw] rounded-lg p-4 relative">
    <h3 class="pb-4 font-bold text-right text-[var(--eggshell-white-500)] text-xl tracking-wide">my interests</h3>

    <div class="hobbies-list grid grid-cols-3 gap-4">
        {#each interests as interest}
            <span class="hobbies-item font-sans font-bold text-xl p-2 bg-[var(--eggshell-white-500)] text-[var(--liver-brown-500)]">{interest.name}</span>
        {/each}
    </div>

</div>

<style>


    .hobbies::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--liver-brown-500);
        z-index: -1;
    }
</style>