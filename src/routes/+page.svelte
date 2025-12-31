<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte'
  import WhyItWorks from '$lib/components/WhyItWorks.svelte'
  import Footer from '@/components/Footer.svelte'
  import { ArrowRight, Sparkles } from 'lucide-svelte'
  import Lenis from 'lenis'
  import { onMount, onDestroy } from 'svelte'
  import 'lenis/dist/lenis.css'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

  import InDepthCourses from '$lib/components/InDepthCourses.svelte'

  // Hero Image
  const heroImg = '/assets/hero.jpg'

  let lenis: Lenis

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger)
    lenis = new Lenis()

    // Velocity 3D Effect (Z-Axis) - Desktop Only
    const mm = gsap.matchMedia()

    // mm.add('(min-width: 1024px)', () => {
    //   ScrollTrigger.create({
    //     onUpdate: (self) => {
    //       const v = self.getVelocity()
    //       // Calculate deformation values
    //       const scale = 1 - Math.min(Math.abs(v) / 4000, 0.01) // Max 1% shrink (Ultra-Subtle)
    //       const rotation = gsap.utils.clamp(-1, 1, v / -800) // Max 1deg tilt (Ultra-Subtle)

    //       gsap.to('.velocity-skew', {
    //         scale: scale,
    //         rotationX: rotation,
    //         transformPerspective: 600, // Adds depth perception
    //         transformOrigin: 'center center',
    //         duration: 0.5,
    //         ease: 'power2.out', // Smooth return
    //         overwrite: 'auto',
    //       })
    //     },
    //   })
    // })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  })

  onDestroy(() => {
    if (lenis) {
      lenis.destroy()
    }
  })
</script>

<Navbar />

<main class="bg-background min-h-screen p-4">
  <div class="mx-auto w-full max-w-[1400px]">
    <!-- Bento Grid Container -->
    <div class="bento-grid">
      <!-- Top Row: Navbar Removed -->

      <!-- Hero Section -->
      <div
        class="velocity-skew bento-card relative col-span-12 min-h-[500px] overflow-hidden text-white"
        style="background: linear-gradient(270deg, rgba(20, 23, 28, 0.00) 32.56%, #14171C 107.32%), url('/assets/hero.jpg') lightgray 50% / cover no-repeat;"
      >
        <!-- Content -->
        <div class="relative z-10 flex h-full flex-col justify-center gap-[1.5rem] px-8 pt-20 pb-8 lg:px-[4rem] lg:py-[6rem]">
          <h1 class="text-display-1 max-w-4xl text-white" style="leading-trim: both; text-edge: cap;">
            Design <span class="italic">scalable</span><br />
            <span class="italic">products</span> in weeks<span class="italic">,</span><br />
            not years
          </h1>

          <p class="text-body-large max-w-xl text-gray-300">
            Everything you need to design your SAAS or any online business—even as a complete beginner or a newly created startup.
          </p>

          <div class="flex flex-col gap-2 sm:flex-row">
            <a
              href="/toolz"
              class="flex items-center justify-center rounded-full border border-white/20 bg-transparent px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
            >
              Explore Toolz
            </a>
            <button class="flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-bold text-black transition-transform hover:scale-105">
              Start courses for free
            </button>
          </div>
        </div>
      </div>

      <!-- Why It Works Section -->
      <WhyItWorks />

      <!-- In-Depth Courses Section -->
      <div class="col-span-12">
        <InDepthCourses />
      </div>

      <!-- Social Proof / Logos -->
      <div class="velocity-skew bento-card section-padding col-span-12 flex flex-col items-center justify-between gap-8 bg-green-50 md:flex-row">
        <div class="flex flex-col gap-2">
          <p class="text-body font-medium text-[#14171C]">
            308 entrepreneurs and<br />startups love the courses
          </p>
          <span class="inline-block w-fit rounded-full bg-green-400 px-2 py-0.5 text-[10px] font-bold text-[#14171C]">+12 this month</span>
        </div>

        <div class="flex flex-1 justify-end gap-12 opacity-50 grayscale">
          <!-- Placeholders for partner logos -->
          <div class="h-8 w-8 rotate-45 border border-black"></div>
          <div class="h-8 w-8 rotate-45 border border-black"></div>
          <div class="h-8 w-8 rotate-45 border border-black"></div>
          <div class="h-8 w-8 rotate-45 border border-black"></div>
          <div class="h-8 w-8 rotate-45 border border-black"></div>
          <div class="h-8 w-8 rotate-45 border border-black"></div>
        </div>
      </div>

      <!-- Footer -->
      <div class="velocity-skew bento-card col-span-12 rounded-2xl bg-white">
        <Footer brand_name="Make It Pop" twitter="alexandreambrosi" />
      </div>
    </div>
  </div>
</main>
