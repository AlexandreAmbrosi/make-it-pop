<script lang="ts">
  import { onMount } from 'svelte'
  import type { PageData } from './$types'

  const getDate = (timestamp: string) => {
    const dateObject = new Date(timestamp)
    const month = dateObject.toLocaleString('en-us', { month: 'long' })
    const date = dateObject.getDate()
    const year = dateObject.getFullYear()
    return `${month} ${date}, ${year}`
  }

  export let data: PageData

  $: all = data.blogs
    .filter((i) => i.created_at)
    .filter((i) => i.published !== false)
    .sort((a, b) => (new Date(a.created_at).getTime() > new Date(b.created_at).getTime() ? -1 : 1))

  onMount(() => {
    const createPagefindListener = () => {
      if (window.PagefindUI) {
        new window.PagefindUI({
          element: '#search',
          processResult: (result: any) => {
            if (result.url.length > 1) {
              result.url = `/blog${result.url.replace('.html', '')}`
              return result
            }
          },
        })
      }
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

<div class="relative mx-auto flex max-w-7xl flex-col px-8 py-8">
  <h1 class="max-w-max text-3xl font-extrabold text-branding sm:text-4xl">Your Blog</h1>
  <h2 class="mt-4 text-gray-400">Stay up to date with the latest news and updates</h2>
  <div class="mt-3 hidden" id="search"></div>
  <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
    {#each all as i, idx}
      <a href={`/blog/${i.slug}`} class="flex flex-col">
        <img
          alt={i.title}
          loading={idx === 0 ? 'eager' : 'lazy'}
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
