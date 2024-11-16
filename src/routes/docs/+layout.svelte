<script lang="ts">
  import { navigating, page } from '$app/stores'
  import { Popover, PopoverContent, PopoverTrigger } from '@/lib/components/ui/popover'
  import IconCross from '~icons/gridicons/cross'
  import IconHamburger from '~icons/hugeicons/menu-09'
  import RightArrow from '~icons/weui/arrow-filled'
  import OnThisPageIcon from '~icons/bitcoin-icons/menu-outline'
  import type { PageData } from './$types'

  interface Props {
    data: PageData
    children: any
  }

  let { data, children }: Props = $props()

  let all = $derived(data.docs.filter((i) => i.published !== false).sort((a, b) => (new Date(a.created_at).getTime() > new Date(b.created_at).getTime() ? -1 : 1)))
  let currentDoc = $derived(data.docs.find((i) => i._meta.path.replace('.svelte', '') === $page.url.pathname.replace('/docs/', '')))

  const toggleSidebar = () => {
    document.getElementById('sidebar')?.classList.toggle('hidden')
  }
</script>

<div class="mt-3 flex items-center border-b border-gray-100 px-8 pb-2 lg:hidden">
  <button onclick={toggleSidebar} class="rounded-full border p-1">
    <IconHamburger />
  </button>
  <div class="ml-4 flex min-w-0 space-x-3 whitespace-nowrap text-sm leading-6">
    <div class="flex flex-row items-center space-x-3">
      <Popover>
        <PopoverTrigger>
          <span>On this page</span>
        </PopoverTrigger>
        <PopoverContent class="flex flex-col gap-x-0 gap-y-2 divide-y px-5 py-2">
          {#each currentDoc.tableOfContents as tocItem}
            <a href={tocItem.slug} class="block py-1 text-primary">{tocItem.content}</a>
          {/each}
        </PopoverContent>
      </Popover>
      <RightArrow />
    </div>
    <div class="truncate font-semibold text-gray-900 dark:text-gray-200">{currentDoc.title}</div>
  </div>
</div>

<div class="relative mx-auto flex max-w-7xl flex-col px-4">
  <div
    id="sidebar"
    class={['fixed bottom-0 right-auto top-[0rem] z-20 -ml-[1rem] hidden w-[18rem] bg-white lg:top-[2rem] lg:-ml-[0rem] lg:block lg:bg-transparent', $navigating && '!hidden']
      .filter(Boolean)
      .join(' ')}
  >
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
            {#each all as i}
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
    <div class="relative mx-auto box-border w-full grow flex-col px-4 lg:-ml-40 lg:pl-[23.7rem] xl:w-[calc(100%-28rem)]">
      {@render children()}
    </div>
    <div class="z-10 box-border hidden w-[19rem] pl-10 xl:flex">
      <div class="fixed h-[calc(100%-7rem)] w-[16.5rem] space-y-2 overflow-y-auto text-sm leading-6 text-gray-600">
        <div class="flex items-center space-x-2 font-medium text-gray-700">
          <OnThisPageIcon class="-ml-1 p-0" />
          <span>On this page</span>
        </div>
        <ul>
          {#each currentDoc.tableOfContents as tocItem}
            <li>
              <a href={tocItem.slug} class="block py-1 text-primary">{tocItem.content}</a>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</div>
