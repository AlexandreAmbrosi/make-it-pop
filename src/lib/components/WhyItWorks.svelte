<script lang="ts">
  // Images
  const tail = '/assets/bubble-tail-1.svg'

  import { onMount } from 'svelte'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xPct = (e.clientX / window.innerWidth - 0.5) * 2
      const yPct = (e.clientY / window.innerHeight - 0.5) * 2

      gsap.to('.tilt', {
        rotationY: xPct * 15, // Reduced rotation intensity
        rotationX: -yPct * 15,
        x: xPct * 20, // Reduced horizontal movement intensity
        y: yPct * 20, // Reduced vertical movement intensity
        duration: 2,
        ease: 'power2.out',
        transformPerspective: 600,
        transformOrigin: 'center center',
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Blurred Bubbles Parallax
    gsap.registerPlugin(ScrollTrigger)

    // Set initial scales (moved from Tailwind classes to ensure GSAP control)
    gsap.set('.blurred-bubble-1', { scale: 1.5 })
    gsap.set('.blurred-bubble-3', { scale: 3 })

    const bubbles = [
      { target: '.blurred-bubble-1', speed: 80 },
      { target: '.blurred-bubble-2', speed: 50 },
      { target: '.blurred-bubble-3', speed: 120 },
    ]

    bubbles.forEach(({ target, speed }) => {
      gsap.to(target, {
        scrollTrigger: {
          trigger: '.why-it-works',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        yPercent: speed,
        ease: 'none',
      })
    })

    // Desynchronized Floating Animation (Organic Movement)
    const floaters = document.querySelectorAll('.floating')
    floaters.forEach((floater) => {
      // Randomize Y Movement
      gsap.to(floater, {
        y: gsap.utils.random(-15, 15),
        duration: gsap.utils.random(2, 4),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: gsap.utils.random(0, 2),
      })

      // Randomize X Movement (Different timing from Y for organic feel)
      gsap.to(floater, {
        x: gsap.utils.random(-10, 10),
        duration: gsap.utils.random(3, 5),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: gsap.utils.random(0, 2),
      })
    })
  })
</script>

<div
  class="why-it-works velocity-skew bento-card relative col-span-12 flex h-auto flex-col overflow-hidden overflow-x-hidden rounded-lg bg-[#fdeeee] pb-8 md:col-span-12 lg:block lg:h-[550px] lg:pb-0"
>
  <!-- Main Heading -->
  <h2
    class="reveal lg:text-6lg relative top-0 left-0 mt-12 mb-12 w-full px-8 text-5xl leading-none text-[#ee5959] lg:absolute lg:top-1/2 lg:left-12 lg:mt-0 lg:mb-0 lg:w-auto lg:-translate-y-1/2 lg:px-0"
    style="font-family: 'WS Paradose', sans-serif;"
  >
    We’ve all been there<span class="italic">.</span>
  </h2>

  <!-- --- Blurred Background Bubbles (False 3D) --- -->

  <!-- Blurred Bubble 1 (Top Left) -->
  <div class="blurred-bubble-1 pointer-events-none absolute -top-6 -left-12 hidden w-fit flex-col items-start blur-sm select-none lg:flex">
    <div class="floating">
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
  </div>

  <!-- Blurred Bubble 2 (Top Right) -->
  <div
    class="blurred-bubble-2 pointer-events-none absolute top-12 -right-30 hidden w-fit flex-col items-start blur-sm select-none sm:-top-4 sm:-right-40 sm:flex md:top-10 md:-right-20"
  >
    <div class="floating">
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
  </div>

  <!-- Blurred Bubble 3 (Bottom Left) -->
  <div class="blurred-bubble-3 pointer-events-none absolute -bottom-12 -left-12 hidden w-fit flex-col items-start blur-sm select-none sm:-left-100 sm:flex md:-left-60 lg:-left-12">
    <div class="floating">
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
  </div>

  <!-- --- Foreground Bubbles (Desktop) & Responsive List (Mobile) --- -->

  <!-- 
    Mobile behavior: Items stack vertically with margin.
    Desktop behavior: Absolute positioning based on Figma coordinates.
  -->

  <!-- Bubble 1: "Watched dozens of tutorials" -->
  <div class="reveal relative mx-8 mb-4 flex w-fit flex-col items-start sm:mx-20 md:mx-30 lg:absolute lg:top-[100px] lg:left-[520px] lg:z-20 lg:mx-0 lg:mb-0 xl:left-[650px]">
    <div class="tilt">
      <div class="floating">
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
    </div>
  </div>

  <!-- Bubble 2: "Never ready enough" -->
  <div
    class="reveal relative mx-8 mb-4 flex w-fit flex-col items-start self-end sm:mx-12 lg:absolute lg:top-[221px] lg:left-[600px] lg:z-20 lg:mx-0 lg:mb-0 lg:self-auto xl:left-[720px]"
  >
    <div class="tilt">
      <div class="floating">
        <div class="relative shrink-0 overflow-clip rounded-lg bg-[#ee5959] px-4 pt-3 pb-4">
          <p class="max-w-[293px] text-xl leading-7 font-medium text-white" style="font-family: 'Celex Grotesk', sans-serif;">
            My product design is never ‘ready enough’ to launch.
          </p>
        </div>
        <div class="flex w-full shrink-0 scale-x-[-1] items-center px-4 py-0 lg:scale-x-[1]">
          <div class="h-3 w-3 shrink-0">
            <img alt="" class="block h-full w-full max-w-none" src={tail} />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bubble 3: "Subjective opinions" -->
  <div class="reveal relative mx-8 mb-4 flex w-fit flex-col items-start sm:mx-12 lg:absolute lg:top-[350px] lg:left-[590px] lg:z-20 lg:mx-0 lg:mb-0 xl:left-[670px]">
    <div class="tilt">
      <div class="floating">
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
    </div>
  </div>

  <!-- Bubble 4: "Loss of time..." -->
  <div class="reveal relative mx-8 flex w-fit flex-col items-start self-end sm:mx-30 md:mx-36 lg:top-[257px] lg:left-[1100px] lg:z-20 lg:mx-0 lg:hidden lg:self-auto xl:flex">
    <div class="tilt">
      <div class="floating">
        <div class="relative shrink-0 overflow-clip rounded-lg bg-[#ee5959] px-4 pt-3 pb-4">
          <p class="max-w-[223px] text-xl leading-7 font-medium text-white" style="font-family: 'Celex Grotesk', sans-serif;">
            I lose a lot of time going back and forth on design decisions.
          </p>
        </div>
        <div class="flex shrink-0 scale-x-[-1] items-center self-end px-4 py-0 lg:scale-x-100 lg:self-start">
          <div class="h-3 w-3 shrink-0">
            <img alt="" class="block h-full w-full max-w-none" src={tail} />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
