<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte'
  import WhyItWorks from '$lib/components/WhyItWorks.svelte'
  import { ArrowRight, Sparkles } from 'lucide-svelte'

  // Hero Image
  const heroImg = '/assets/hero.jpg'
</script>

<main class="bg-background min-h-screen p-4">
  <div class="mx-auto max-w-[1400px]">
    <!-- Bento Grid Container -->
    <div class="bento-grid">
      <!-- Top Row: Navbar -->
      <Navbar />

      <!-- Hero Section -->
      <div
        class="bento-card relative col-span-12 min-h-[500px] overflow-hidden text-white md:col-span-12"
        style="background: linear-gradient(270deg, rgba(20, 23, 28, 0.00) 32.56%, #14171C 107.32%), url('/assets/hero.jpg') lightgray 50% / cover no-repeat;"
      >
        <!-- Content -->
        <div class="relative z-10 flex h-full flex-col justify-center gap-[1.5rem] px-[4rem] py-[6rem]">
          <h1 class="max-w-4xl text-[80px] leading-[80px] font-[400] text-white" style="font-family: 'WS Paradose', serif; leading-trim: both; text-edge: cap;">
            Design <span class="italic">scalable</span><br />
            <span class="italic">products</span> in weeks<span class="italic">,</span><br />
            not <span class="italic">years</span>
          </h1>

          <p class="max-w-xl text-lg font-light text-gray-300 md:text-xl">
            Everything you need to design your SAAS or any online business—even as a complete beginner or a newly created startup.
          </p>

          <div class="flex flex-col gap-4 sm:flex-row">
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

      <!-- Social Proof / Logos (Placeholder based on layout) -->
      <div class="bento-card col-span-12 flex flex-col items-center justify-between gap-8 bg-green-50 px-8 py-12 md:flex-row">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-[#14171C]">
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
    </div>
  </div>
</main>
