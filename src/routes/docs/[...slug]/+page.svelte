<script lang="ts">
  import Seo from '@/components/SEO.svelte'
  import type { PageData } from './$types'
  import XIcon from '~icons/fa6-brands/x-twitter'
  import GitHubIcon from '~icons/line-md/github'
  import LinkedInIcon from '~icons/mdi/linkedin'
  import RightArrow from '~icons/weui/arrow-filled'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
</script>

{#if data.post.title}
  <Seo title={data.post.title} description={data.post.description} />
{/if}

<div data-pagefind-body class="flex flex-col">
  <h1 class="text-branding text-2xl font-extrabold tracking-tight sm:text-3xl">{data.post.title}</h1>
  <h2 class="prose prose-gray mt-2 text-lg">{data.post.description}</h2>
  <article class="prose prose-gray mt-8 min-w-full">
    {@html data.post.mdx}
  </article>
  <div class="mt-14 leading-6">
    <div class="mb-12 flex items-center px-0.5 text-sm font-semibold text-gray-700">
      {#if data.post.prev}
        <a class="z-20 flex items-center space-x-3" href={`/docs/${data.post.prev._meta.path.replace('.svelte', '')}`}>
          <RightArrow class="rotate-180" />
          <span>{data.post.prev.title}</span>
        </a>
      {/if}
      {#if data.post.next}
        <a class="z-20 ml-auto flex items-center space-x-3" href={`/docs/${data.post.next._meta.path.replace('.svelte', '')}`}>
          <span>{data.post.next.title}</span>
          <RightArrow />
        </a>
      {/if}
    </div>
    <div class="flex justify-between gap-12 border-t border-gray-100 pt-10 pb-28 sm:flex">
      <div class="flex gap-6">
        <a href="https://x.com/rishi_raj_jain_" target="_blank">
          <XIcon class="text-gray-400" width="24" height="24" />
        </a>
        <a href="https://github.com/rishi-raj-jain" target="_blank">
          <GitHubIcon class="text-gray-400" width="24" height="24" />
        </a>
        <a href="https://www.linkedin.com/company/launchfast" target="_blank">
          <LinkedInIcon class="text-gray-400" width="24" height="24" />
        </a>
      </div>
    </div>
  </div>
</div>
