<script lang="ts">
  import { page } from '$app/stores'
  import { Popover, PopoverContent, PopoverTrigger } from '@/lib/components/ui/popover'
  import IconCross from '~icons/gridicons/cross'
  import IconHamburger from '~icons/hugeicons/menu-09'
  import IconDown from '~icons/oui/arrow-down'
  import User from './User.svelte'

  interface Props {
    /*
    A component that can be used anywhere in your app

    <Header logo="https://rishi.app/static/favicon-image.jpg" />
  */
    logo?: string
  }

  let { logo = 'https://ik.imagekit.io/vjeqenuhn/launchfast-website/symbol-logo' }: Props = $props()
  let isMenuOpen = $state(false)
  const toggleMenu = () => (isMenuOpen = !isMenuOpen)
</script>

<div class="relative mx-auto flex max-w-7xl flex-row items-center justify-between px-8 pt-2">
  <a href="/" class="flex flex-row items-center gap-x-2">
    <img alt="LaunchFast Logo" src={logo} class="max-w-[140px]" decoding="async" loading="lazy" />
  </a>
  <div class="hidden flex-row items-center gap-x-8 sm:flex">
    <a class={['text-sm text-gray-800 hover:text-launchfast hover:underline', $page.url.pathname.includes('/blog') && 'font-semibold'].filter(Boolean).join(' ')} href="/blog">
      Blog
    </a>
    <a class={['text-sm text-gray-800 hover:text-launchfast hover:underline', $page.url.pathname.includes('/docs') && 'font-semibold'].filter(Boolean).join(' ')} href="/docs">
      Docs
    </a>
    <a class={['text-sm text-gray-800 hover:text-launchfast hover:underline', $page.url.pathname === '/dashboard' && 'font-semibold'].filter(Boolean).join(' ')} href="/dashboard">
      Dashboard
    </a>
    <Popover>
      <PopoverTrigger>
        <div class="flex cursor-pointer flex-row items-center gap-x-3">
          <span class="text-sm">Pages</span>
          <IconDown width="1em" height="1em" />
        </div>
      </PopoverTrigger>
      <PopoverContent class="flex flex-col gap-0 p-0">
        <a class={['px-5 pt-3 text-sm', $page.url.pathname === '/protected' && 'font-semibold'].filter(Boolean).join(' ')} href="/protected"> Protected </a>
        <a class={['mt-3 border-t px-5 py-3 text-sm', $page.url.pathname === '/protected_and_paid' && 'font-semibold'].filter(Boolean).join(' ')} href="/protected_and_paid">
          Protected and Paid
        </a>
        <a
          href="/partial_protected_and_paid"
          class={['border-t px-5 py-3 text-sm', $page.url.pathname === '/partial_protected_and_paid' && 'font-semibold'].filter(Boolean).join(' ')}
        >
          Partial Protected and Paid
        </a>
      </PopoverContent>
    </Popover>
    <User />
  </div>
  <div class="flex flex-row items-center gap-x-3 sm:hidden">
    <User />
    <button onclick={toggleMenu} class="rounded-full border p-1">
      <IconHamburger />
    </button>
  </div>
  {#if isMenuOpen}
    <div class="absolute right-0 top-0 z-[1000] flex h-screen w-[250px] flex-col overflow-hidden border-l bg-white shadow-2xl transition-all duration-300 ease-in-out sm:!hidden">
      <div class="flex flex-row items-center justify-between border-b px-5 py-2">
        <span>Menu</span>
        <button onclick={toggleMenu} class="rounded-full border p-1">
          <IconCross height="14" width="14" />
        </button>
      </div>
      <div class="flex flex-col gap-y-4 p-5">
        <a class={['/' === $page.url.pathname && 'font-semibold'].filter(Boolean).join(' ')} href="/">Home</a>
        <a class={[$page.url.pathname.includes('/blog') && 'font-semibold'].filter(Boolean).join(' ')} href="/blog">Blog</a>
        <a class={[$page.url.pathname.includes('/docs') && 'font-semibold'].filter(Boolean).join(' ')} href="/docs">Docs</a>
        <a class={['/dashboard' === $page.url.pathname && 'font-semibold'].filter(Boolean).join(' ')} href="/dashboard">Dashboard</a>
        <a class={['/protected' === $page.url.pathname && 'font-semibold'].filter(Boolean).join(' ')} href="/protected">Protected</a>
        <a class={['/protected_and_paid' === $page.url.pathname && 'font-semibold'].filter(Boolean).join(' ')} href="/protected_and_paid">Protected and Paid</a>
        <a class={['/partial_protected_and_paid' === $page.url.pathname && 'font-semibold'].filter(Boolean).join(' ')} href="/partial_protected_and_paid">
          Partial Protected and Paid
        </a>
      </div>
    </div>
  {/if}
</div>
