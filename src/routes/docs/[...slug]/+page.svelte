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
  <h1 class="text-2xl font-extrabold tracking-tight text-branding sm:text-3xl">{data.post.title}</h1>
  <h2 class="prose prose-gray mt-2 text-lg">{data.post.description}</h2>
  <article class="prose prose-gray mt-8 min-w-full">
    {@html data.post.mdx}
  </article>
  <div class="mt-14 leading-6">
    <div class="mb-12 flex items-center px-0.5 text-sm font-semibold text-gray-700">
      {#if data.post.prev}
        <a class="group flex items-center space-x-3" href={`/docs/${data.post.prev._meta.path.replace('.svelte', '')}`}
          ><svg viewBox="0 0 3 6" class="h-1.5 overflow-visible stroke-gray-400 group-hover:stroke-gray-600"
            ><path d="M3 0L0 3L3 6" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg
          ><span class="group-hover:text-gray-900">{data.post.prev.title}</span></a
        >
      {/if}
      {#if data.post.next}
        <a class="group ml-auto flex items-center space-x-3" href={`/docs/${data.post.next._meta.path.replace('.svelte', '')}`}
          ><span class="group-hover:text-gray-900">Authentication</span><svg viewBox="0 0 3 6" class="h-1.5 rotate-180 overflow-visible stroke-gray-400 group-hover:stroke-gray-600"
            ><path d="M3 0L0 3L3 6" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg
          ></a
        >
      {/if}
    </div>
    <div class="flex justify-between gap-12 border-t border-gray-100 pb-28 pt-10 sm:flex">
      <div class="flex gap-6">
        <a href="https://x.com/neondatabase" target="_blank">
          <span class="sr-only">x</span>
          <svg class="h-5 w-5 bg-gray-400 hover:bg-gray-500"></svg>
        </a>
        <a href="https://github.com/neondatabase" target="_blank">
          <span class="sr-only">github</span>
          <svg class="h-5 w-5 bg-gray-400 hover:bg-gray-500"></svg>
        </a>
        <a href="https://www.linkedin.com/company/neondatabase" target="_blank">
          <span class="sr-only">linkedin</span>
          <svg class="h-5 w-5 bg-gray-400 hover:bg-gray-500"></svg>
        </a>
      </div>
    </div>
  </div>
</div>
