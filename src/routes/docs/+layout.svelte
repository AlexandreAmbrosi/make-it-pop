<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import type { PageData } from './$types'
  import IconCross from '~icons/gridicons/cross'

  interface Props {
    data: PageData
    children: any
  }

  let { data, children }: Props = $props()

  let all = $derived(data.docs.filter((i) => i.published !== false).sort((a, b) => (new Date(a.created_at).getTime() > new Date(b.created_at).getTime() ? -1 : 1)))
  let currentDoc = $derived(data.docs.find((i) => i._meta.path.replace('.svelte', '') === $page.url.pathname.replace('/docs/', '')))

  const toggleSidebar = () => {
    document.getElementById('sidebar').classList.toggle('hidden')
  }
</script>

<div class="mt-4 flex items-center px-5 lg:hidden">
  <button onclick={toggleSidebar} type="button" class="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
    <span class="sr-only">Navigation</span>
    <svg class="h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path
        d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
      ></path>
    </svg>
  </button>
  <div class="ml-4 flex min-w-0 space-x-3 whitespace-nowrap text-sm leading-6">
    <div class="flex items-center space-x-3">
      <span>Documentation</span>
      <svg width="3" height="24" viewBox="0 -9 3 24" class="h-5 rotate-0 overflow-visible fill-gray-400">
        <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
      </svg>
    </div>
    <div class="truncate font-semibold text-gray-900 dark:text-gray-200">{currentDoc.title}</div>
  </div>
</div>

<div class="relative mx-auto flex max-w-7xl flex-col px-4">
  <div id="sidebar" class="fixed bottom-0 right-auto top-[0rem] z-20 -ml-[1rem] hidden w-[18rem] bg-white lg:top-[2rem] lg:-ml-[0rem] lg:block lg:bg-transparent">
    <div class="absolute inset-0 z-10 overflow-auto pb-10 pr-8">
      <div class="relative lg:text-sm lg:leading-6">
        <div class="sticky top-0 h-8">
          <div class="mt-4 flex flex-row items-center justify-between lg:hidden">
            <h5 class="pl-4 font-semibold text-branding">Documentation</h5>
            <button onclick={toggleSidebar} class="text-xs">
              <IconCross height="14" width="14" />
            </button>
          </div>
        </div>
        <div>
          <h5 class="mb-3.5 mt-2 hidden pl-4 font-semibold text-branding lg:mb-2.5 lg:block">Documentation</h5>
          <ul>
            {#each all as i, idx}
              <li class="scroll-m-4 first:scroll-m-20">
                <a
                  href={`/docs/${i._meta.path.replace('.svelte', '')}`}
                  class="group mt-2 flex max-w-max cursor-pointer items-center space-x-3 rounded-lg py-1.5 pl-[1rem] pr-8 text-gray-700 hover:bg-gray-600/5 hover:text-gray-900 focus:outline-primary lg:mt-0"
                >
                  <div class={$page.url.pathname === ['/docs', i._meta.path.replace('.svelte', '')].filter(Boolean).join('/') && 'font-semibold'}>
                    {i.title}
                  </div>
                </a>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="box-border flex w-full flex-row gap-12 pt-8 lg:pt-6">
    <div class="relative mx-auto box-border w-full grow flex-col px-1 lg:-ml-40 lg:pl-[23.7rem] xl:w-[calc(100%-28rem)]">
      {@render children()}
    </div>
    <div class="z-10 box-border hidden w-[19rem] pl-10 xl:flex">
      <div class="fixed h-[calc(100%-7rem)] w-[16.5rem] space-y-2 overflow-y-auto text-sm leading-6 text-gray-600">
        <div class="flex items-center space-x-2 font-medium text-gray-700">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3">
            <path d="M2.44434 12.6665H13.5554" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M2.44434 3.3335H13.5554" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M2.44434 8H7.33323" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <span>On this page</span>
        </div>
        <ul>
          {#each currentDoc.tableOfContents as tocItem}
            <li>
              <a href={'#' + tocItem.slug} class="block py-1 text-primary">{tocItem.content}</a>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</div>
