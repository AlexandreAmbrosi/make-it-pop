<script lang="ts">
  import Seo from '@/components/SEO.svelte'
  import { getDate } from '@/lib/utils/date'
  import type { PageData } from './$types'
  import { onMount } from 'svelte'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()

  let all = $derived(data.blogs.filter((i) => i.published !== false).sort((a, b) => (new Date(a.created_at).getTime() > new Date(b.created_at).getTime() ? -1 : 1)))

  onMount(() => {
    const createPagefindListener = () => {
      if (window.PagefindUI) {
        new window.PagefindUI({
          element: '#search',
        })
      } else {
        var script = document.createElement('script')
        script.onload = createPagefindListener
        script.src = '/pagefind/pagefind-ui.js'
        document.head.appendChild(script)
        var stylesheet = document.createElement('link')
        stylesheet.rel = 'stylesheet'
        stylesheet.href = '/pagefind/pagefind-ui.css'
        document.head.appendChild(stylesheet)
        document.getElementById('search')?.classList.remove('hidden')
      }
    }
    createPagefindListener()
  })
</script>

<Seo title={'Blog'} description={'Latest news and updates from Company'} />

<div class="relative mx-auto flex max-w-7xl flex-col px-8 py-8">
  <h1 class="mt-4 max-w-max text-3xl font-extrabold text-black sm:text-4xl">Blog</h1>
  <h2 class="my-4 text-gray-400">Latest news and updates from Company</h2>
  <div id="search"></div>
  <div class="mt-12 h-[1px] w-full bg-black/5"></div>
  <div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
    {#each all as i, idx}
      <a href={['/blog', i._meta.path.replace('.svelte', '')].join('/')} class="flex flex-col">
        <img
          width="900"
          height="600"
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
