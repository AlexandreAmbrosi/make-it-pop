<script lang="ts">
  import type { PageData } from './$types'
  import Author from '@/components/Author.svelte'
  import SocialSharing from '@/components/Social-Sharing.svelte'
  import Seo from '@/components/SEO.svelte'
  import config from '@/config'
  import { getDate } from '@/lib/utils/date'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
</script>

{#if data.post.title}
  <Seo title={data.post.title} description={data.post.description} />
{/if}

<div data-pagefind-body class="relative mx-auto flex max-w-2xl flex-col px-8 py-8">
  <h1 class="text-3xl font-extrabold text-branding">{data.post.title}</h1>
  {#if data.post.show_author !== false}
    <div class="flex flex-row items-center justify-between">
      <Author name="Rishi Raj Jain" image="https://ik.imagekit.io/vjeqenuhn/static/headshot.jpeg" />
      <SocialSharing title={data.post.title} url={new URL(`/blog/${data.post._meta.path.replace('.svelte', '')}`, config.url).toString()} />
    </div>
  {/if}
  <img alt={data.post.title} src={data.post.blog_image} class="rounded py-4" />
  <article class="prose">
    {@html data.post.mdx}
  </article>
  <div class="mt-8 h-[1px] w-full bg-gray-100"></div>
  {#if data.post.prev}
    <a href={`/blog/${data.post.prev._meta.path.replace('.svelte', '')}`} class="text-md mt-8 flex flex-col gap-x-8 font-medium hover:underline sm:flex-row">
      <img src={data.post.prev.blog_image} alt={data.post.prev.title} class="w-full rounded sm:w-[200px]" />
      <div class="mt-4 flex flex-col gap-y-2 sm:mt-0">
        <span>{data.post.prev.title}</span>
        <span class="text-sm font-light text-gray-400">{getDate(data.post.prev.created_at)}</span>
      </div>
    </a>
  {/if}
  {#if data.post.next}
    <a href={`/blog/${data.post.next._meta.path.replace('.svelte', '')}`} class="text-md mt-8 flex flex-col gap-x-8 font-medium hover:underline sm:flex-row">
      <img src={data.post.next.blog_image} alt={data.post.next.title} class="w-full rounded sm:w-[200px]" />
      <div class="mt-4 flex flex-col gap-y-2 sm:mt-0">
        <span>{data.post.next.title}</span>
        <span class="text-sm font-light text-gray-400">{getDate(data.post.next.created_at)}</span>
      </div>
    </a>
  {/if}
</div>
