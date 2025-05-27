<script lang="ts">

    interface ArticleBlockProps {
        title: string;
        content: string;
        width?: 'sm' | 'md' | 'lg';
        class?: string;
    }

    let { title, content, width = 'sm', class: className }: ArticleBlockProps = $props();

    const widthMap = {
        'sm': 'max-w-48',
        'md': 'max-w-96',
        'lg': 'max-w-screen-sm'
    }
</script>

<a class="style-none" href="blog/article"><div class="article-block flex flex-col gap-3 relative z-index-2 hover:scale-105 transition-all duration-300 {className}">
    <div class="article-block-title text-base font-bold">{title}</div>
    <p class="article-block-content bg-[var(--transit-yellow-500)] border border-[var(--liver-brown-500)] rounded-lg p-4 {widthMap[width]}">
        {content}
    </p>
</div>
</a>