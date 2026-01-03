<script lang="ts">
  import { Menu, X } from 'lucide-svelte'
  import { page } from '$app/stores'
  import { slide, fade } from 'svelte/transition'
  import { onMount } from 'svelte'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
  import { getClientSession } from '$lib/utils/session'

  let isMobileMenuOpen = $state(false)
  let isScrolled = $state(false)

  // Random Hover CTAs
  const ctas = ['Discover!', 'Explore!', "I'll explain everything", "Let's gooo", 'Curious?', 'Check it out', 'Worth a look', 'Pop it!', '*click*', "That's a CTA btw"]
  const getRandomCta = () => ctas[Math.floor(Math.random() * ctas.length)]

  let inspirCta = $state(getRandomCta())
  let toolzCta = $state(getRandomCta())
  let learnCta = $state(getRandomCta())
  let accountCta = $state(getRandomCta())
  let menuTl: gsap.core.Timeline

  onMount(() => {
    // Initialize session for other components (like dashboard)
    getClientSession()

    gsap.registerPlugin(ScrollTrigger)

    ScrollTrigger.create({
      start: 50,
      onUpdate: (self) => {
        isScrolled = self.direction === 1 || self.scroll() > 50
      },
    })

    // Mobile Header Hide Logic - Mobile Only
    const mm = gsap.matchMedia()

    mm.add('(max-width: 1023px)', () => {
      const showAnim = gsap
        .from('#mobile-header', {
          yPercent: -160,
          paused: true,
          duration: 0.3,
          ease: 'power2.out',
        })
        .progress(1)

      ScrollTrigger.create({
        start: 'top top',
        end: 'max',
        onUpdate: (self) => {
          // DOM-based check as the single source of truth
          if (document.body.classList.contains('menu-open')) return
          self.direction === -1 ? showAnim.play() : showAnim.reverse()
        },
      })
    })

    // Curve Swipe Menu Animation (Bottom -> Top)
    // Coords: 0,0 is Top-Left. 0,100 is Bottom-Left.
    const startPath = 'M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z' // Flat at bottom
    const curvePath = 'M 0 60 Q 50 0 100 60 L 100 100 L 0 100 Z' // Convex curve rising
    const endPath = 'M 0 0 Q 50 0 100 0 L 100 100 L 0 100 Z' // Full screen flat

    menuTl = gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        gsap.set('#menu-overlay', { visibility: 'hidden' })
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
        document.body.classList.remove('menu-open')
      },
    })

    menuTl
      .set('#menu-overlay', { visibility: 'visible' })
      .set('.menu-content-item', { opacity: 0, y: 50 }) // Initial state for content items
      // Button Morph Animation
      .to('.icon-burger', { rotation: 90, opacity: 0, scale: 0.5, duration: 0.3, ease: 'power2.inOut' }, 0)
      .to('.icon-close', { rotation: 0, opacity: 1, scale: 1, duration: 0.3, ease: 'power2.inOut' }, 0)
      // Logo Center Animation
      .to('.mobile-logo', { x: () => window.innerWidth / 2 - 100, duration: 0.4, ease: 'power2.inOut' }, 0)
      .to('#overlay-path', {
        attr: { d: curvePath },
        duration: 0.4,
        ease: 'power2.in',
      })
      .to('#overlay-path', {
        attr: { d: endPath },
        duration: 0.4,
        ease: 'power2.out',
      })
      .to(
        '.menu-content-item',
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.1, // Stagger the content items' animation
        },
        '-=0.2',
      ) // Start content animation slightly before path completes
  })

  function toggleMenu() {
    isMobileMenuOpen = !isMobileMenuOpen
    if (isMobileMenuOpen) {
      document.body.classList.add('menu-open')
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'

      // Kill any scroll-triggered animations on the header and force it visible
      gsap.killTweensOf('#mobile-header')
      gsap.to('#mobile-header', { yPercent: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })

      menuTl.invalidate().play()
    } else {
      menuTl.reverse()
    }
  }
</script>

<!-- Mobile Header (Sticky & Auto-Hide) -->
<div id="mobile-header" class="fixed top-6 right-6 left-6 z-[70] flex items-center justify-between rounded-md bg-white px-4 py-3 shadow-none transition-transform lg:hidden">
  <a href="/" class="origin-left transition-transform duration-300 hover:scale-95">
    <img src="/assets/logo.svg" alt="Make It Pop" class="mobile-logo w-[120px]" />
  </a>
  <button onclick={toggleMenu} class="relative h-6 w-6 text-[#14171C]">
    <!-- Burger Icon -->
    <div class="icon-burger absolute inset-0">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Burger--Streamline-Core" class="h-6 w-6">
        <desc>Burger Streamline Icon: https://streamlinehq.com</desc>
        <g id="burger--burger-fast-cook-cooking-nutrition-food">
          <path
            id="Union"
            fill="currentColor"
            fill-rule="evenodd"
            d="M1.18359 1.0936C1.93591 0.389977 2.94953 0 4 0h6c1.0505 0 2.0641 0.389977 2.8164 1.0936C13.5699 1.79828 14 2.76147 14 3.77346c0 0.39187 -0.1667 0.76033 -0.4514 1.02652 -0.2834 0.26513 -0.6612 0.40876 -1.0486 0.40876h-11c-0.38743 0 -0.765168 -0.14363 -1.048645 -0.40876C0.166747 4.53379 0 4.16533 0 3.77346 0 2.76147 0.430139 1.79828 1.18359 1.0936ZM0.769592 6.75c-0.414213 0 -0.7499997 0.33579 -0.7499997 0.75s0.3357867 0.75 0.7499997 0.75H13.2304c0.4142 0 0.75 -0.33579 0.75 -0.75s-0.3358 -0.75 -0.75 -0.75H0.769592Zm-0.463508 3.2674C0.495961 9.84094 0.746138 9.74757 1 9.74757h1.5c0.07278 0 0.14468 0.01588 0.21069 0.04655l2.69517 1.25228 1.25378 -1.1651c0.0925 -0.08596 0.21409 -0.13373 0.34036 -0.13373h6c0.2539 0 0.504 0.09337 0.6939 0.26983 0.1911 0.1776 0.3061 0.4266 0.3061 0.6948 0 0.8843 -0.3784 1.7243 -1.0383 2.3375C12.303 13.6619 11.4169 14 10.5 14h-7c-0.9169 0 -1.80297 -0.3381 -2.46168 -0.9503C0.378363 12.4365 0 11.5965 0 10.7122c0 -0.2682 0.114971 -0.5172 0.306084 -0.6948Z"
            clip-rule="evenodd"
            stroke-width="1"
          ></path>
        </g>
      </svg>
    </div>

    <!-- Close Icon (Hidden Initially) -->
    <div class="icon-close absolute inset-0 bg-transparent opacity-0" style="transform: rotate(-90deg) scale(0.5);">
      <X size={24} />
    </div>
  </button>
</div>

<!-- Mobile Overlay Menu (Curve Swipe) -->
<div id="menu-overlay" class="pointer-events-auto invisible fixed inset-0 z-[60] h-screen w-full lg:hidden">
  <!-- SVG Curtain -->
  <svg class="absolute top-0 left-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path id="overlay-path" d="M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z" fill="white" />
  </svg>

  <!-- Content Container -->
  <div class="relative z-10 flex h-full flex-col p-4 pt-24">
    <!-- Navigation Items -->
    <div class="menu-content-item flex h-full flex-col gap-4 overflow-hidden">
      {#snippet MobileLink(href: any, label: any, color: any, icon: any)}
        <a
          {href}
          class={`bento-card group relative flex w-full flex-1 items-center justify-center ${color} text-[22px] font-medium text-white transition-transform active:scale-[0.98] active:brightness-95`}
        >
          {label}
          {#if icon}
            {@render icon()}
          {/if}
        </a>
      {/snippet}

      <a
        href="/inspird"
        class="bento-card group relative flex w-full flex-1 items-center justify-center bg-violet-500 text-[22px] font-medium text-white transition-transform active:scale-[0.98] active:brightness-95"
      >
        Inspir'd
        <span class="absolute top-2 right-2 rounded-full bg-white px-2 py-0.5 text-[8px] font-bold tracking-wider whitespace-nowrap text-[#14171C] uppercase">Coming soon :D</span>
      </a>

      <a
        href="/toolz"
        class="bento-card group relative flex w-full flex-1 items-center justify-center bg-yellow-500 text-[22px] font-medium text-white transition-transform active:scale-[0.98] active:brightness-95"
      >
        Toolz
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="absolute top-1 right-1 h-[18px] w-[18px] text-white opacity-70 transition-opacity"
        >
          <path d="M5.25 12.75L12.75 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M5.25 5.25H12.75V12.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>

      <a
        href="/learn"
        class="bento-card group relative flex w-full flex-1 items-center justify-center bg-sky-500 text-[22px] font-medium text-white transition-transform active:scale-[0.98] active:brightness-95"
      >
        Coursez
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="absolute top-1 right-1 h-[18px] w-[18px] text-white opacity-70 transition-opacity"
        >
          <path d="M5.25 12.75L12.75 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M5.25 5.25H12.75V12.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>

      {#if $page.data.session}
        <a
          href="/dashboard"
          class="bento-card group relative flex w-full flex-1 items-center justify-center bg-green-500 px-8 text-[22px] font-medium whitespace-nowrap text-[#23481b] transition-transform active:scale-[0.98] active:brightness-95"
        >
          My Account
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="absolute top-1 right-1 h-[18px] w-[18px] text-[#23481b] opacity-70 transition-opacity"
          >
            <path d="M5.25 12.75L12.75 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5.25 5.25H12.75V12.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      {:else}
        <a
          href="/signin"
          class="bento-card group relative flex w-full flex-1 items-center justify-center bg-green-500 px-8 text-[22px] font-medium whitespace-nowrap text-[#23481b] transition-transform active:scale-[0.98] active:brightness-95"
        >
          Sign In
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="absolute top-1 right-1 h-[18px] w-[18px] text-[#23481b] opacity-70 transition-opacity"
          >
            <path d="M5.25 12.75L12.75 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5.25 5.25H12.75V12.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      {/if}
    </div>
  </div>
</div>

<!-- Desktop Navbar Configuration (Hidden on Mobile, Sticky on Desktop) -->
<nav class={`-mb-4 hidden w-full bg-white py-4 transition-all duration-300 lg:sticky lg:top-0 lg:z-50 lg:block ${isScrolled ? '!pt-2 !pb-2' : ''}`}>
  <div class="mx-auto grid w-full max-w-[1400px] grid-cols-12 gap-[8px] px-4 min-[1450px]:px-0">
    <!-- Logo Tile -->
    <a href="/" class={`bento-card col-span-4 flex items-center justify-start bg-transparent pl-4 transition-all duration-300 hover:scale-95 ${isScrolled ? 'py-1' : 'py-4'}`}>
      <img src="/assets/logo.svg" alt="Make It Pop" class={`transition-all duration-300 ${isScrolled ? 'w-[150px]' : 'w-[250px]'}`} />
    </a>

    <!-- Navigation Tiles Container -->
    <div class="col-span-8 flex gap-[8px]">
      <a
        href="/inspird"
        onmouseenter={() => (inspirCta = getRandomCta())}
        class={`bento-card group relative flex flex-1 items-center justify-center bg-violet-500 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-violet-400 ${isScrolled ? 'h-[50px] text-[18px]' : 'h-[72px] text-[22px]'}`}
      >
        <!-- No Arrow for Inspir'd -->
        <!-- No Arrow for Inspir'd -->
        <div class="relative h-full w-full overflow-hidden">
          <span class="absolute inset-0 flex items-center justify-center px-2 transition-transform duration-300 group-hover:-translate-y-full">Inspir'd</span>
          <span
            class="absolute inset-0 flex translate-y-full items-center justify-center px-2 text-center font-serif leading-[0.8] transition-transform duration-300 group-hover:translate-y-0"
            >{inspirCta}</span
          >
        </div>
        <span class="absolute top-2 right-2 rounded-full bg-white px-2 py-0.5 text-[8px] font-bold tracking-wider whitespace-nowrap text-[#14171C] uppercase">Coming soon :D</span>
      </a>

      <a
        href="/toolz"
        onmouseenter={() => (toolzCta = getRandomCta())}
        class={`bento-card group relative flex flex-1 items-center justify-center overflow-hidden bg-yellow-500 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-yellow-400 ${isScrolled ? 'h-[50px] text-[18px]' : 'h-[72px] text-[22px]'}`}
      >
        <div class="relative h-full w-full overflow-hidden">
          <span class="absolute inset-0 flex items-center justify-center px-2 transition-transform duration-300 group-hover:-translate-y-full">Toolz</span>
          <span
            class="absolute inset-0 flex translate-y-full items-center justify-center px-2 text-center font-serif leading-[0.8] transition-transform duration-300 group-hover:translate-y-0"
            >{toolzCta}</span
          >
        </div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="absolute top-1 right-1 h-[18px] w-[18px] text-white opacity-70 transition-all duration-300 group-hover:translate-x-[150%] group-hover:-translate-y-[150%] group-hover:opacity-100"
        >
          <path d="M5.25 12.75L12.75 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M5.25 5.25H12.75V12.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>

      <a
        href="/learn"
        onmouseenter={() => (learnCta = getRandomCta())}
        class={`bento-card group relative flex flex-1 items-center justify-center overflow-hidden bg-sky-500 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-sky-400 ${isScrolled ? 'h-[50px] text-[18px]' : 'h-[72px] text-[22px]'}`}
      >
        <div class="relative h-full w-full overflow-hidden">
          <span class="absolute inset-0 flex items-center justify-center px-2 transition-transform duration-300 group-hover:-translate-y-full">Coursez</span>
          <span
            class="absolute inset-0 flex translate-y-full items-center justify-center px-2 text-center font-serif leading-[0.8] transition-transform duration-300 group-hover:translate-y-0"
            >{learnCta}</span
          >
        </div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="absolute top-1 right-1 h-[18px] w-[18px] text-white opacity-70 transition-all duration-300 group-hover:translate-x-[150%] group-hover:-translate-y-[150%] group-hover:opacity-100"
        >
          <path d="M5.25 12.75L12.75 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M5.25 5.25H12.75V12.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>

      {#if $page.data.session}
        <a
          href="/dashboard"
          onmouseenter={() => (accountCta = getRandomCta())}
          class={`bento-card group relative flex w-fit min-w-max items-center justify-center overflow-hidden bg-green-500 px-8 font-medium text-[#23481b] transition-all duration-300 hover:scale-[1.02] ${isScrolled ? 'h-[50px] text-[18px]' : 'h-[72px] text-[22px]'}`}
        >
          <div class="relative h-full w-full overflow-hidden">
            <span class="px-2 opacity-0">My Account</span>
            <span class="absolute inset-0 flex items-center justify-center px-2 transition-transform duration-300 group-hover:-translate-y-full">My Account</span>
            <span
              class="absolute inset-0 flex translate-y-full items-center justify-center px-2 text-center font-serif leading-[0.8] transition-transform duration-300 group-hover:translate-y-0"
              >{accountCta}</span
            >
          </div>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="absolute top-1 right-1 h-[18px] w-[18px] text-[#23481b] opacity-70 transition-all duration-300 group-hover:translate-x-[150%] group-hover:-translate-y-[150%] group-hover:opacity-100"
          >
            <path d="M5.25 12.75L12.75 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5.25 5.25H12.75V12.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      {:else}
        <a
          href="/signin"
          onmouseenter={() => (accountCta = getRandomCta())}
          class={`bento-card group relative flex w-fit min-w-max items-center justify-center overflow-hidden bg-green-500 px-8 font-medium text-[#23481b] transition-all duration-300 hover:scale-[1.02] ${isScrolled ? 'h-[50px] text-[18px]' : 'h-[72px] text-[22px]'}`}
        >
          <div class="relative h-full w-full overflow-hidden">
            <span class="px-2 opacity-0">Sign In</span>
            <span class="absolute inset-0 flex items-center justify-center px-2 transition-transform duration-300 group-hover:-translate-y-full">Sign In</span>
            <span
              class="absolute inset-0 flex translate-y-full items-center justify-center px-2 text-center font-serif leading-[0.8] transition-transform duration-300 group-hover:translate-y-0"
              >{accountCta}</span
            >
          </div>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="absolute top-1 right-1 h-[18px] w-[18px] text-[#23481b] opacity-70 transition-all duration-300 group-hover:translate-x-[150%] group-hover:-translate-y-[150%] group-hover:opacity-100"
          >
            <path d="M5.25 12.75L12.75 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5.25 5.25H12.75V12.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      {/if}
    </div>
  </div>
</nav>
