<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import type { PageData } from './$types'

  interface Props {
    data: PageData
    children: any
  }

  let { data, children }: Props = $props()

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

<div class="relative mx-auto mt-4 flex w-full max-w-7xl flex-row px-8" id="search"></div>
<div class="relative mx-auto mt-4 flex w-full max-w-7xl flex-row px-8">
  <div class="flex w-full max-w-max flex-col pr-8 pt-8">
    {#each all as i, idx}
      <a href={`/docs/${i.file}`} class={`${idx !== 0 && 'mt-2'} ${$page.url.pathname === ['/docs', i.file].filter(Boolean).join('/') && 'font-semibold'} text-sm`}>
        {i.title}
      </a>
    {/each}
  </div>
  <div class="flex max-w-[calc(100%-100px)] flex-col border-l p-8">{@render children()}</div>
  <!-- <div class="flex w-[130px] flex-col border-l pl-8 pt-8">
    {#each all as i, idx}
      <a href={`/docs/${i.file}`} class={`${idx !== 0 && 'mt-2'} text-sm`}>
        {i.title}
      </a>
    {/each}
  </div> -->
</div>
