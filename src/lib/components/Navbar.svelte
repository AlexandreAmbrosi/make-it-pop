<script lang="ts">
  import { ArrowUpRight } from 'lucide-svelte'
  import { page } from '$app/stores'
</script>

<!-- Logo Tile -->
<div class="bento-card col-span-12 flex items-center justify-start bg-transparent py-4 pl-4 md:col-span-4">
  <img src="/assets/logo.svg" alt="Make It Pop" class="w-[250px]" />
</div>

<!-- Navigation Tiles Container -->
<div class="col-span-12 flex gap-[8px] md:col-span-8">
  <a
    href="/inspird"
    class="bento-card group relative flex h-[72px] flex-1 items-center justify-center bg-violet-500 text-[22px] font-medium text-white transition-transform hover:scale-[1.02]"
  >
    <!-- No Arrow for Inspir'd -->
    Inspir'd
    <span class="absolute top-2 right-2 rounded-full bg-white px-2 py-0.5 text-[8px] font-bold tracking-wider whitespace-nowrap text-[#14171C] uppercase">Coming soon :D</span>
  </a>

  <a
    href="/toolz"
    class="bento-card group relative flex h-[72px] flex-1 items-center justify-center bg-yellow-500 text-[22px] font-medium text-white transition-transform hover:scale-[1.02]"
  >
    Toolz
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="absolute top-1 right-1 h-[18px] w-[18px] text-white opacity-70 transition-opacity group-hover:opacity-100"
    >
      <path d="M5.25 12.75L12.75 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M5.25 5.25H12.75V12.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </a>

  <a
    href="/learn"
    class="bento-card group relative flex h-[72px] flex-1 items-center justify-center bg-sky-500 text-[22px] font-medium text-white transition-transform hover:scale-[1.02]"
  >
    Coursez
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="absolute top-1 right-1 h-[18px] w-[18px] text-white opacity-70 transition-opacity group-hover:opacity-100"
    >
      <path d="M5.25 12.75L12.75 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M5.25 5.25H12.75V12.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </a>

  {#if $page.data.session}
    <a
      href="/dashboard"
      class="bento-card group relative flex h-[72px] w-fit min-w-max items-center justify-center bg-green-500 px-8 text-[22px] font-medium whitespace-nowrap text-[#23481b] transition-transform hover:scale-[1.02]"
    >
      My Account
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="absolute top-1 right-1 h-[18px] w-[18px] text-[#23481b] opacity-70 transition-opacity group-hover:opacity-100"
      >
        <path d="M5.25 12.75L12.75 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M5.25 5.25H12.75V12.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </a>
  {:else}
    <a
      href="/signin"
      class="bento-card group relative flex h-[72px] w-fit min-w-max items-center justify-center bg-green-500 px-8 text-[22px] font-medium whitespace-nowrap text-[#23481b] transition-transform hover:scale-[1.02]"
    >
      Sign In
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="absolute top-1 right-1 h-[18px] w-[18px] text-[#23481b] opacity-70 transition-opacity group-hover:opacity-100"
      >
        <path d="M5.25 12.75L12.75 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M5.25 5.25H12.75V12.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </a>
  {/if}
</div>
