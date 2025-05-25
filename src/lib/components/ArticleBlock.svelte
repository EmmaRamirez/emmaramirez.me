<script lang="ts">

    interface ArticleBlockProps {
        title: string;
        content: string;
        width?: 'sm' | 'md' | 'lg';
    }

    let { title, content, width = 'sm' }: ArticleBlockProps = $props();

    const widthMap = {
        'sm': 'max-w-48',
        'md': 'max-w-96',
        'lg': 'max-w-screen-sm'
    }
</script>

<div class="article-block flex flex-col gap-3">
    <div class="article-block-title text-base font-bold">{title}</div>
    <p class="article-block-content bg-[var(--transit-yellow-500)] border border-[var(--transit-yellow-800)] rounded-lg p-4 {widthMap[width]}">
        {content}
    </p>
</div>