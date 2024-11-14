<script lang="ts">
  import Seo from '@/components/SEO.svelte'
  import type { PageData } from './$types'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
</script>

{#if data.post.title}
  <Seo title={data.post.title} description={data.post.description} />
{/if}

<div data-pagefind-body class="flex flex-col">
  <h1 class="max-w-max text-3xl font-extrabold text-branding sm:text-4xl">{data.post.title}</h1>
  <h2 class="mt-3 text-gray-400">{data.post.description}</h2>
  <article class="prose min-w-full">
    {@html data.post.mdx}
  </article>
  {#if data.post.prev}
    <a href={`/docs/${data.post.prev._meta.path.replace('.svelte', '')}`} class="text-md mt-8 font-medium hover:underline">
      &larr; <span>{data.post.prev.title}</span>
    </a>
  {/if}
  {#if data.post.next}
    <a href={`/docs/${data.post.next._meta.path.replace('.svelte', '')}`} class="text-md mt-8 font-medium hover:underline">
      <span>{data.post.next.title}</span> &rarr;
    </a>
  {/if}
</div>
