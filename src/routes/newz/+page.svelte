<script lang="ts">
  import Seo from '@/components/SEO.svelte'
  import { getDate } from '@/lib/utils/date'
  import type { PageData } from './$types'
  import { onMount } from 'svelte'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()

  // Use DB articles if available, fallback to empty array
  let all = $derived(data.articles || []);
  
  // pagefind logic kept as is but likely won't index properly without static files.
  // We can hide search or implement DB search later.

  onMount(() => {
     // ... pagefind might fail gracefully
  })
</script>

<Seo title={'Newz'} description={'Latest news and updates from Make It Pop'} />

<div class="relative mx-auto flex max-w-7xl flex-col px-8 py-8">
  <h1 class="mt-4 max-w-max text-3xl font-extrabold text-black sm:text-4xl">Newz</h1>
  <h2 class="my-4 text-gray-400">Latest news and updates from Make It Pop</h2>
  
  <div class="mt-12 h-[1px] w-full bg-black/5"></div>
  <div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
    {#each all as i, idx}
      <a href={`/newz/${i.slug}`} class="flex flex-col group">
        <div class="w-full h-48 bg-gray-100 rounded overflow-hidden mb-4">
            <img
            alt={i.title}
            loading={idx === 0 ? 'eager' : 'lazy'}
            class="w-full h-full object-cover group-hover:scale-105 transition-transform"
            src={i.imageUrl || 'https://ik.imagekit.io/vjeqenuhn/launchfast-website/general'}
            />
        </div>
        {#if i.createdAt}
          <span class="mt-1 font-light text-gray-600 text-sm">{getDate(i.createdAt)}</span>
        {/if}
        <h3 class="mt-1 text-xl font-medium group-hover:text-purple-600 transition-colors">{i.title}</h3>
        <p class="text-sm text-gray-500 line-clamp-2 mt-1">{i.description}</p>
      </a>
    {/each}
  </div>
</div>
