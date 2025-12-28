<script lang="ts">
  // Images
  const tail = '/assets/bubble-tail-1.svg'
</script>

<div class="bento-card relative col-span-12 flex h-auto flex-col overflow-hidden overflow-x-hidden rounded-lg bg-[#fdeeee] pb-12 md:col-span-12 lg:block lg:h-[550px] lg:pb-0">
  <!-- Main Heading -->
  <h2
    class="lg:text-6lg relative top-0 left-0 mt-12 mb-12 w-full px-8 text-5xl leading-none text-[#ee5959] lg:absolute lg:top-1/2 lg:left-12 lg:mt-0 lg:mb-0 lg:w-auto lg:-translate-y-1/2 lg:px-0"
    style="font-family: 'WS Paradose', sans-serif;"
  >
    We’ve all been there<span class="italic">.</span>
  </h2>

  <!-- --- Blurred Background Bubbles (False 3D) --- -->

  <!-- Blurred Bubble 1 (Top Left) -->
  <div class="pointer-events-none absolute -top-6 -left-12 hidden scale-[1.5] flex-col items-start blur-sm select-none lg:flex">
    <div class="relative shrink-0 overflow-clip rounded-lg bg-[#ee5959] px-4 pt-3 pb-4">
      <p class="max-w-[450px] text-xl leading-7 font-medium text-white" style="font-family: 'Celex Grotesk', sans-serif;">
        My product design is never <br /> ‘ready enough’ to launch.
      </p>
    </div>
    <div class="flex w-full shrink-0 scale-x-[-1] items-center px-4 py-0">
      <div class="h-3 w-3 shrink-0">
        <img alt="" class="block h-full w-full max-w-none" src={tail} />
      </div>
    </div>
  </div>

  <!-- Blurred Bubble 2 (Top Right) -->
  <div class="pointer-events-none absolute top-12 -right-30 hidden flex-col items-start blur-sm select-none sm:-top-4 sm:-right-40 sm:flex md:top-10 md:-right-20">
    <div class="relative shrink-0 overflow-clip rounded-lg bg-[#ee5959] px-4 pt-3 pb-4">
      <p class="max-w-[450px] text-xl leading-7 font-medium text-white" style="font-family: 'Celex Grotesk', sans-serif;">
        My product design is never <br /> ‘ready enough’ to launch.
      </p>
    </div>
    <div class="flex w-full shrink-0 items-center px-4 py-0">
      <div class="h-3 w-3 shrink-0">
        <img alt="" class="block h-full w-full max-w-none" src={tail} />
      </div>
    </div>
  </div>

  <!-- Blurred Bubble 3 (Bottom Left) -->
  <div class="pointer-events-none absolute -bottom-20 -left-12 hidden scale-[3] flex-col items-start blur-sm select-none sm:-left-100 sm:flex md:-left-60 lg:-left-12">
    <div class="relative shrink-0 overflow-clip rounded-lg bg-[#ee5959] px-4 pt-3 pb-4">
      <p class="max-w-[450px] text-xl leading-7 font-medium text-white" style="font-family: 'Celex Grotesk', sans-serif;">
        My product design is never <br /> ‘ready enough’ to launch.
      </p>
    </div>
    <div class="flex w-full shrink-0 scale-x-[-1] items-center px-4 py-0">
      <div class="h-3 w-3 shrink-0">
        <img alt="" class="block h-full w-full max-w-none" src={tail} />
      </div>
    </div>
  </div>

  <!-- --- Foreground Bubbles (Desktop) & Responsive List (Mobile) --- -->

  <!-- 
    Mobile behavior: Items stack vertically with margin.
    Desktop behavior: Absolute positioning based on Figma coordinates.
  -->

  <!-- Bubble 1: "Watched dozens of tutorials" -->
  <div
    class="relative mx-8 mb-4 flex flex-col items-start transition-transform duration-300 hover:scale-105 sm:mx-20 md:mx-30 lg:absolute lg:top-[100px] lg:left-[520px] lg:z-20 lg:mx-0 lg:mb-0 xl:left-[650px]"
  >
    <div class="relative shrink-0 overflow-clip rounded-lg bg-[#ee5959] px-4 pt-3 pb-4">
      <p class="max-w-[400px] text-xl leading-7 font-medium text-white" style="font-family: 'Celex Grotesk', sans-serif;">
        I’ve watched dozens of design tutorials, but I still don’t know what to do next.
      </p>
    </div>
    <div class="flex w-full shrink-0 items-center px-4 py-0">
      <div class="h-3 w-3 shrink-0">
        <img alt="" class="block h-full w-full max-w-none" src={tail} />
      </div>
    </div>
  </div>

  <!-- Bubble 2: "Never ready enough" -->
  <div
    class="relative mx-8 mb-4 flex flex-col items-start self-end transition-transform duration-300 hover:scale-105 sm:mx-12 lg:absolute lg:top-[221px] lg:left-[600px] lg:z-20 lg:mx-0 lg:mb-0 lg:self-auto xl:left-[720px]"
  >
    <div class="relative shrink-0 overflow-clip rounded-lg bg-[#ee5959] px-4 pt-3 pb-4">
      <p class="max-w-[293px] text-xl leading-7 font-medium text-white" style="font-family: 'Celex Grotesk', sans-serif;">My product design is never ‘ready enough’ to launch.</p>
    </div>
    <div class="flex w-full shrink-0 scale-x-[-1] items-center px-4 py-0 lg:scale-x-[1]">
      <div class="h-3 w-3 shrink-0">
        <img alt="" class="block h-full w-full max-w-none" src={tail} />
      </div>
    </div>
  </div>

  <!-- Bubble 3: "Subjective opinions" -->
  <div
    class="relative mx-8 mb-4 flex flex-col items-start transition-transform duration-300 hover:scale-105 sm:mx-12 lg:absolute lg:top-[350px] lg:left-[590px] lg:z-20 lg:mx-0 lg:mb-0 xl:left-[670px]"
  >
    <div class="relative shrink-0 overflow-clip rounded-lg bg-[#ee5959] px-4 pt-3 pb-4">
      <p class="max-w-[315px] text-xl leading-7 font-medium text-white" style="font-family: 'Celex Grotesk', sans-serif;">
        Design discussions always turn into subjective opinions.
      </p>
    </div>
    <div class="flex w-full shrink-0 items-center px-4 py-0">
      <div class="h-3 w-3 shrink-0">
        <img alt="" class="block h-full w-full max-w-none" src={tail} />
      </div>
    </div>
  </div>

  <!-- Bubble 4: "Loss of time..." -->
  <div
    class="relative mx-8 flex flex-col items-start self-end transition-transform duration-300 hover:scale-105 sm:mx-30 md:mx-36 lg:top-[257px] lg:left-[1100px] lg:z-20 lg:mx-0 lg:hidden lg:self-auto xl:flex"
  >
    <div class="relative shrink-0 overflow-clip rounded-lg bg-[#ee5959] px-4 pt-3 pb-4">
      <p class="max-w-[223px] text-xl leading-7 font-medium text-white" style="font-family: 'Celex Grotesk', sans-serif;">
        I lose a lot of time going back and forth on design decisions.
      </p>
    </div>
    <div class="flex w-full shrink-0 scale-x-[-1] items-center px-4 py-0">
      <div class="h-3 w-3 shrink-0">
        <img alt="" class="block h-full w-full max-w-none" src={tail} />
      </div>
    </div>
  </div>
</div>
