<script lang="ts">
  import { Popover, PopoverContent, PopoverTrigger } from '@/lib/components/ui/popover'
  import { slug } from 'github-slugger'
  import IconCross from '~icons/mdi/close'
  import IconHamburger from '~icons/radix-icons/hamburger-menu'
  import User from './User.svelte'
  interface Props {
    /*
    A component that can be used anywhere in your app

    <Header logo="https://rishi.app/static/favicon-image.jpg" />
  */
    logo?: string
  }
  let { logo = 'https://ik.imagekit.io/vjeqenuhn/launchfast-website/purple-icon.png' }: Props = $props()
  const header = {
    viewID: slug('header'),
    labelID: 'view-' + slug('header'),
  }
  const css = `#${header['viewID']} {display: none;}#${header['labelID']}:checked + #${header['viewID']} {display: flex;}`
</script>

<div class="relative mx-auto flex max-w-7xl flex-row items-center justify-between px-8 pt-2">
  <a href="/" class="flex flex-row items-center gap-x-2">
    <img alt="LaunchFast Logo" height="30" width="30" src={logo} class="h-[30px] w-[30px] rounded-full bg-gray-100" />
    <span class="text-2xl font-semibold text-branding">LaunchFast</span>
  </a>
  <div class="hidden flex-row items-center gap-x-8 sm:flex">
    <a class="flex flex-row items-center gap-x-2 text-gray-800 hover:text-launchfast hover:underline" href="/blog"> Blog </a>
    <a class="flex flex-row items-center gap-x-2 text-gray-800 hover:text-launchfast hover:underline" href="/dashboard"> Dashboard </a>
    <Popover>
      <PopoverTrigger>
        <div class="flex cursor-pointer flex-row items-center gap-x-3">
          <span>Pages</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
            <path
              fill="currentColor"
              d="M10.103 12.778L16.81 6.08a.69.69 0 0 1 .99.012a.726.726 0 0 1-.012 1.012l-7.203 7.193a.69.69 0 0 1-.985-.006L2.205 6.72a.727.727 0 0 1 0-1.01a.69.69 0 0 1 .99 0z"
            ></path>
          </svg>
        </div>
      </PopoverTrigger>
      <PopoverContent class="flex max-w-max flex-col px-0">
        <a class="px-5" href="/protected"> Protected </a>
        <a class="mt-3 border-t px-5 pt-3" href="/partial_protected_and_paid"> Partial Protected and Paid </a>
        <a class="mt-3 border-t px-5 pt-3" href="/protected_and_paid"> Protected and Paid </a>
      </PopoverContent>
    </Popover>
    <User />
  </div>
  <label class="sm:hidden" for={header.labelID}>
    <IconHamburger />
  </label>
  <input class="hidden" type="checkbox" id={header.labelID} />
  <div
    id={header.viewID}
    class="fixed right-0 top-0 z-20 flex h-screen w-[250px] flex-col overflow-hidden border-l bg-white shadow-2xl transition-all duration-300 ease-in-out sm:!hidden"
  >
    <div class="flex flex-row items-center justify-between border-b px-5 py-2">
      <span>Menu</span>
      <label class="rounded-full border p-2" for={header.labelID}>
        <IconCross />
      </label>
    </div>
    <div class="flex flex-col gap-y-4 p-5">
      <a class="flex flex-row items-center gap-x-2 text-gray-800 hover:text-launchfast hover:underline" href="/pricing"> Pricing </a>
      <a class="flex flex-row items-center gap-x-2 text-gray-800 hover:text-launchfast hover:underline" href="/blog"> Blog </a>
      <User />
    </div>
  </div>
</div>

{@html `\<style\>${css}\<\/style\>`}
