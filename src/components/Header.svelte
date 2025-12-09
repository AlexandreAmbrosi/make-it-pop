<script lang="ts">
  import { navigating, page } from '$app/stores'
  import { Popover, PopoverContent, PopoverTrigger } from '@/lib/components/ui/popover'
  import IconCross from '~icons/gridicons/cross'
  import IconHamburger from '~icons/hugeicons/menu-09'
  import User from './User.svelte'
  import Logo from './Logo.svelte'

  const toggleMenu = () => {
    const headerMenuElm = document.getElementById('header-menu')
    if (headerMenuElm) {
      if (headerMenuElm.classList.contains('hidden')) {
        headerMenuElm.classList.remove('hidden')
        headerMenuElm.classList.add('flex')
      } else {
        headerMenuElm.classList.add('hidden')
        headerMenuElm.classList.remove('flex')
      }
    }
  }
</script>

<div class="relative mx-auto flex max-w-7xl flex-row items-center justify-between px-8 pt-2">
  <a href="/" class="z-10 flex flex-row items-center gap-x-2">
    <Logo />
    <span class="font-semibold text-[#9810fa]">Make It Pop</span>
  </a>
  <div class="hidden flex-row items-center gap-x-8 sm:flex">
    <a class={['hover:text-launchfast text-sm text-gray-800 hover:underline', $page.url.pathname.includes('/toolz') && 'font-semibold'].filter(Boolean).join(' ')} href="/toolz">
      Toolz
    </a>
    <a class={['hover:text-launchfast text-sm text-gray-800 hover:underline', $page.url.pathname.includes('/newz') && 'font-semibold'].filter(Boolean).join(' ')} href="/newz">
      Newz
    </a>
    <a class={['hover:text-launchfast text-sm text-gray-800 hover:underline', $page.url.pathname.includes('/learn') && 'font-semibold'].filter(Boolean).join(' ')} href="/learn">
      Learn
    </a>
    <User />
  </div>
  <div class="flex flex-row items-center gap-x-3 sm:hidden">
    <User />
    <button onclick={toggleMenu} class="rounded-full border p-1">
      <IconHamburger />
    </button>
  </div>
  <div
    id="header-menu"
    class={[
      'absolute top-0 right-0 z-1000 hidden h-screen w-[250px] flex-col overflow-hidden border-l bg-white shadow-2xl transition-all duration-300 ease-in-out sm:hidden!',
      $navigating && 'hidden!',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <div class="flex flex-row items-center justify-between border-b px-5 py-2">
      <span>Menu</span>
      <button onclick={toggleMenu} class="rounded-full border p-1">
        <IconCross height="14" width="14" />
      </button>
    </div>
    <div class="flex flex-col gap-y-4 p-5">
      <a class={['/' === $page.url.pathname && 'font-semibold'].filter(Boolean).join(' ')} href="/">Home</a>
      <a class={[$page.url.pathname.includes('/toolz') && 'font-semibold'].filter(Boolean).join(' ')} href="/toolz">Toolz</a>
      <a class={[$page.url.pathname.includes('/newz') && 'font-semibold'].filter(Boolean).join(' ')} href="/newz">Newz</a>
      <a class={[$page.url.pathname.includes('/learn') && 'font-semibold'].filter(Boolean).join(' ')} href="/learn">Learn</a>
    </div>
  </div>
</div>
