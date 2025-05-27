<script lang="ts">
    let interests = [
        {
            name: 'developer tooling',
            description: 'I love building tools for developers to use.'
        },
        {
            name: 'ai programming',
            description: 'I love using generative ai to create things.'
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
            description: 'I love open source software and the community that surrounds it.'
        },
        {
            name: 'p2p fashion',
            description: 'I love the idea of a p2p fashion system where people can sell their clothes to each other directly without a middleman.'
        },
        {
            name: 'FIRE finance',
            description: 'I love the idea of financial independence and early retirement.'
        },
        {
            name: 'gamification',
            description: 'I love gaming and the community that surrounds it.'
        },
        {
            name: 'data science',
            description: 'I love data science and the community that surrounds it.'
        },
    ];
</script>


<div class="hobbies col-span-2 h-48 self-center mb-4 border-4 border-[var(--liver-brown-500)] ml-[-4vw] rounded-lg p-4 relative">
    <h3 class="pb-4 font-bold text-right text-[var(--eggshell-white-500)] text-xl tracking-wide">my interests</h3>

    <div class="hobbies-list flex flex-row flex-wrap gap-4">
        {#each interests as interest}
        <div class="hobbies-item bg-[var(--lawn-green-500)] border-2 border-[var(--lawn-green-700)] p-2 rounded-lg">
            <span>{interest.name}</span>
        </div>
        {/each}
    </div>

</div>

<style>
    .hobbies-item {
        background-blend-mode: multiply;
        opacity: 0.8;
    }

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