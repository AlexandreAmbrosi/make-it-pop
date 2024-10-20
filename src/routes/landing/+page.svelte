<script lang="ts">
  import Divider from '@/components/Divider.svelte'
  import FAQ from '@/components/FAQ.svelte'
  import Features from '@/components/Features.svelte'
  import Pricing from '@/components/Pricing.svelte'
  import Testimonials from '@/components/Testimonials.svelte'
  import IconStar from '~icons/mdi/star'
</script>

<div class="mx-auto flex flex-row flex-wrap px-8 lg:max-w-7xl">
  <div class="mt-8 flex w-full flex-col lg:w-1/2 lg:pr-8">
    <h1 class="max-w-4xl text-3xl font-extrabold leading-[2.5rem] text-launchfast/70 sm:text-4xl md:text-5xl md:!leading-[4rem]">
      Launch your web apps in days with
      <span class="bg-astro px-2 text-white shadow-2xl">Astro</span>
      ,
      <span class="bg-black/75 px-2 text-white shadow-2xl">Next.js</span>
      and
      <span class="bg-svelte px-2 text-white shadow-2xl">SvelteKit</span>
      Starter Kits
    </h1>
    <h2 class="mt-8 text-gray-400">Maximize Your Productivity with LaunchFa.st Starter Kits</h2>
    <p class="mt-2 text-xl text-gray-600">
      Comprehensive starter kits for SEO, Analytics, Storage, Auth, Payments, Blogs, and Email - everything a developer needs to kickstart their project.
    </p>
    <div class="mt-8 flex flex-row flex-wrap gap-y-3 sm:gap-x-3 sm:gap-y-0">
      <a
        href="/#pricing"
        class="max-w-max rounded-lg bg-gradient-to-br from-branding to-svelte px-5 py-3 text-center text-lg text-white shadow-2xl transition duration-200 sm:text-xl"
      >
        Get LaunchFast Starter Kits&nbsp;&nbsp;&rarr;
      </a>
    </div>
    <div class="mt-12 flex flex-row flex-wrap gap-x-3">
      <div class="flex flex-row -space-x-3">
        <img decoding="async" width="40" height="40" alt="vm" src="https://ik.imagekit.io/vjeqenuhn/launchfast-website/builders/vm.jpeg?tr=h-40" class="size-[40px] rounded-full" />
        <img decoding="async" width="40" height="40" alt="am" src="https://ik.imagekit.io/vjeqenuhn/launchfast-website/builders/am.jpeg?tr=h-40" class="size-[40px] rounded-full" />
        <img decoding="async" width="40" height="40" alt="pm" src="https://ik.imagekit.io/vjeqenuhn/launchfast-website/builders/pm.jpeg?tr=h-40" class="size-[40px] rounded-full" />
        <img decoding="async" width="40" height="40" alt="jm" src="https://ik.imagekit.io/vjeqenuhn/launchfast-website/builders/jm.png?tr=h-40" class="size-[40px] rounded-full" />
        <img decoding="async" width="40" height="40" alt="um" src="https://ik.imagekit.io/vjeqenuhn/launchfast-website/builders/um.jpeg?tr=h-40" class="size-[40px] rounded-full" />
      </div>
      <div class="flex flex-col items-start gap-y-1">
        <div class="flex flex-row items-center gap-x-1">
          <IconStar color="#ffa706" />
          <IconStar color="#ffa706" />
          <IconStar color="#ffa706" />
          <IconStar color="#ffa706" />
          <IconStar color="#ffa706" />
        </div>
        <div class="text-base-content/80 text-base"><span class="text-base-content font-semibold">30+</span> launching web apps already</div>
      </div>
    </div>
  </div>
  <div class="mt-8 flex w-full flex-col lg:w-1/2">
    <img
      width="800"
      height="800"
      class="rounded"
      decoding="async"
      fetchpriority="high"
      src="https://ik.imagekit.io/vjeqenuhn/launchfast-website/showcase.png"
      alt="Upstash, Resend, Stripe, Astro, SvelteKit, Next.js and TailwindCSS is LaunchFast"
    />
  </div>
</div>
<Divider className="mt-24 border-0" />
<Features />
<Divider className="mt-24 border-0" />
<Pricing />
<Divider className="mt-24 border-0" />
<Testimonials />
<Divider className="mt-24 border-0" />
<FAQ />
