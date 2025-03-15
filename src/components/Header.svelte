<script lang="ts">
  import { navigating, page } from '$app/stores'
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

  // onMount(() => {
  //   const createPagefindListener = () => {
  //     if (window.PagefindUI) {
  //       new window.PagefindUI({
  //         element: '#search',
  //       })
  //     } else {
  //       var script = document.createElement('script')
  //       script.onload = createPagefindListener
  //       script.src = '/pagefind/pagefind-ui.js'
  //       document.head.appendChild(script)
  //       var stylesheet = document.createElement('link')
  //       stylesheet.rel = 'stylesheet'
  //       stylesheet.href = '/pagefind/pagefind-ui.css'
  //       document.head.appendChild(stylesheet)
  //       document.getElementById('search')?.classList.remove('hidden')
  //     }
  //   }
  //   createPagefindListener()
  // })
</script>

<div class="relative mx-auto flex max-w-7xl flex-row items-center justify-between px-8 pt-2">
  <a href="/" class="flex flex-row items-center gap-x-2">
    <img alt="LaunchFast Logo" src={logo} class="max-w-[140px]" decoding="async" loading="lazy" />
  </a>
  <div class="hidden flex-row items-center gap-x-8 sm:flex">
    <a class={['hover:text-launchfast text-sm text-gray-800 hover:underline', $page.url.pathname.includes('/blog') && 'font-semibold'].filter(Boolean).join(' ')} href="/blog">
      Blog
    </a>
    <a class={['hover:text-launchfast text-sm text-gray-800 hover:underline', $page.url.pathname.includes('/docs') && 'font-semibold'].filter(Boolean).join(' ')} href="/docs">
      Docs
    </a>
    <a class={['hover:text-launchfast text-sm text-gray-800 hover:underline', $page.url.pathname === '/changelog' && 'font-semibold'].filter(Boolean).join(' ')} href="/changelog">
      Changelog
    </a>
    <a class={['hover:text-launchfast text-sm text-gray-800 hover:underline', $page.url.pathname === '/dashboard' && 'font-semibold'].filter(Boolean).join(' ')} href="/dashboard">
      Dashboard
    </a>
    <Popover>
      <PopoverTrigger>
        <div class="flex cursor-pointer flex-row items-center gap-x-3">
          <span class="text-sm">Pages</span>
          <IconDown width="1em" height="1em" />
        </div>
      </PopoverTrigger>
      <PopoverContent class="flex max-w-[220px] flex-col gap-0 divide-y p-0 text-sm">
        <a class={['px-3 py-2', $page.url.pathname === '/upload' && 'font-semibold'].filter(Boolean).join(' ')} href="/upload"> Upload </a>
        <a class={['px-3 py-2', $page.url.pathname === '/protected' && 'font-semibold'].filter(Boolean).join(' ')} href="/protected"> Protected </a>
        <a class={['px-3 py-2', $page.url.pathname === '/protected_and_paid' && 'font-semibold'].filter(Boolean).join(' ')} href="/protected_and_paid"> Protected and Paid </a>
        <a class={['px-3 py-2', $page.url.pathname === '/partial_protected_and_paid' && 'font-semibold'].filter(Boolean).join(' ')} href="/partial_protected_and_paid">
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
      <a class={[$page.url.pathname.includes('/blog') && 'font-semibold'].filter(Boolean).join(' ')} href="/blog">Blog</a>
      <a class={[$page.url.pathname.includes('/docs') && 'font-semibold'].filter(Boolean).join(' ')} href="/docs">Docs</a>
      <a class={[$page.url.pathname === '/changelog' && 'font-semibold'].filter(Boolean).join(' ')} href="/changelog">Changelog</a>
      <a class={['/dashboard' === $page.url.pathname && 'font-semibold'].filter(Boolean).join(' ')} href="/dashboard">Dashboard</a>
      <a class={['/protected' === $page.url.pathname && 'font-semibold'].filter(Boolean).join(' ')} href="/protected">Protected</a>
      <a class={['/protected_and_paid' === $page.url.pathname && 'font-semibold'].filter(Boolean).join(' ')} href="/protected_and_paid">Protected and Paid</a>
      <a class={['/partial_protected_and_paid' === $page.url.pathname && 'font-semibold'].filter(Boolean).join(' ')} href="/partial_protected_and_paid">
        Partial Protected and Paid
      </a>
    </div>
  </div>
</div>
