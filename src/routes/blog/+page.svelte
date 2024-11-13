<script lang="ts">
  import { onMount } from 'svelte'
  import type { PageData } from './$types'
  import Seo from '@/components/SEO.svelte'

  const getDate = (timestamp: string) => {
    const dateObject = new Date(timestamp)
    const month = dateObject.toLocaleString('en-us', { month: 'long' })
    const date = dateObject.getDate()
    const year = dateObject.getFullYear()
    return `${month} ${date}, ${year}`
  }

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()

  let all = $derived(
    data.blogs
      .filter((i) => i.created_at)
      .filter((i) => i.published !== false)
      .sort((a, b) => (new Date(a.created_at).getTime() > new Date(b.created_at).getTime() ? -1 : 1)),
  )

  onMount(() => {
    const createPagefindListener = () => {
      if (window.PagefindUI)
        new window.PagefindUI({
          element: '#search',
        })
    }
    var script = document.createElement('script')
    script.onload = createPagefindListener
    script.src = '/pagefind/pagefind-ui.js'
    document.head.appendChild(script)
    var stylesheet = document.createElement('link')
    stylesheet.rel = 'stylesheet'
    stylesheet.href = '/pagefind/pagefind-ui.css'
    document.head.appendChild(stylesheet)
    document.getElementById('search')?.classList.remove('hidden')
  })
</script>

<Seo title={'Blog'} description={'Latest news and updates from Company'} />

<div class="relative mx-auto flex max-w-7xl flex-col px-8 py-8">
  <h1 class="mt-4 max-w-max text-3xl font-extrabold text-branding sm:text-4xl">Blog</h1>
  <h2 class="mt-4 text-gray-400">Latest news and updates from Company</h2>
  <div class="mt-12 h-[1px] w-full bg-black/5"></div>
  <div class="mt-12 hidden" id="search"></div>
  <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
    {#each all as i}
      <a href={`/blog/${i.slug}`} class="flex flex-col">
        <img
          alt={i.title}
          class="transform rounded bg-cover bg-center bg-no-repeat will-change-auto"
          src={i?.blog_image ?? 'https://ik.imagekit.io/vjeqenuhn/launchfast-website/general'}
        />
        {#if i.created_at}
          <span class="mt-4 font-light text-gray-600">{getDate(i.created_at)}</span>
        {/if}
        <h3 class="mt-1 text-xl font-medium">{i.title}</h3>
      </a>
    {/each}
  </div>
</div>
