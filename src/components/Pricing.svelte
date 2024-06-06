<script lang="ts">
  /*
    A component that can be used anywhere in your app to display pricing

    <Pricing />
  */

  import features from '@/lib/data/features'
  import TickIcon from 'virtual:icons/mdi/tick'
  import PlusIcon from 'virtual:icons/mdi/plus'

  const pricingFeatures = [...features.map((i) => i.heading), 'Integrations on-demand', 'Priority Support']
</script>

<section id="pricing" class="mx-auto flex max-w-7xl flex-col gap-8 px-8">
  <div class="flex flex-col text-left">
    <a href="/#pricing" class="text-3xl sm:text-4xl">
      <span class="border px-2 text-launchfast">Pay once</span>,
      <span class="bg-astro whitespace-nowrap px-2 font-bold text-white shadow-2xl">use forever</span>
    </a>
    <p class="mt-3 text-xl text-gray-600">
      LaunchFa.st Astro, Next.js and SvelteKit Starter Kits are each a one-time purchase. You get *all* the good things in a single purchase. <span class="text-launchfast">
        Buy the bundle
      </span>
      to get all in one!
    </p>
    <div class="mt-8 grid grid-cols-1 gap-8 rounded border border-gray-100 p-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {#each pricingFeatures as pricingFeature}
        <div class="flex flex-row items-center gap-x-3">
          <TickIcon width="20" height="20" />
          <span>{pricingFeature}</span>
        </div>
      {/each}
      <div class="flex flex-row items-center gap-x-3">
        <PlusIcon width="20" height="20" />
        <span class="underline">And many, many more</span>
      </div>
    </div>
    <div class="mt-8 grid grid-cols-1 sm:grid-cols-3">
      <div class="flex flex-row flex-wrap divide-x divide-white/25 border border-gray-100">
        <div class="flex flex-col p-8">
          <span class="ml-1 text-3xl font-semibold text-black/25 line-through">$150</span>
          <span class="text-astro ml-1 text-7xl font-bold">$75</span>
          <a class="ls-button mt-12" href="https://code-templates.lemonsqueezy.com/buy/97fc7fb0-990d-48da-b924-d40d556105d7">
            <input class="hidden" type="text" name="template" value="astro" />
            <button class="bg-astro max-w-max -rotate-1 rounded border px-4 py-1 text-xl font-medium text-white"> Get Astro Starter Kit &rarr; </button>
            <a href="https://launchfast-astro-ts.vercel.app/" target="_blank" class="mt-4 block max-w-max -rotate-1 rounded border px-4 py-1 text-xl font-medium text-black">
              View Demo &rarr;
            </a>
          </a>
        </div>
        <div class="flex flex-col p-8 text-xl">
          <div class="flex flex-row items-center gap-x-3">
            <TickIcon />
            <span>All goodness as above</span>
          </div>
          <div class="mt-8 flex flex-row items-center gap-x-3">
            <TickIcon />
            <span>Only Astro Starter Kit</span>
          </div>
        </div>
      </div>
      <div class="flex flex-row flex-wrap divide-x divide-white/25 border border-gray-100">
        <div class="flex flex-col p-8">
          <span class="ml-1 text-3xl font-semibold text-black/25 line-through">$150</span>
          <span class="ml-1 text-7xl font-bold text-black">$75</span>
          <a class="ls-button mt-12" href="https://code-templates.lemonsqueezy.com/buy/ad99ba38-1fd3-459d-9381-695b6cdd61f2">
            <input class="hidden" type="text" name="template" value="nextjs" />
            <button class="max-w-max -rotate-1 rounded border bg-black px-4 py-1 text-xl font-medium text-white"> Get Next.js Starter Kit &rarr; </button>
            <a href="https://launchfast-nextjs-ts.vercel.app/" target="_blank" class="mt-4 block max-w-max -rotate-1 rounded border px-4 py-1 text-xl font-medium text-black">
              View Demo &rarr;
            </a>
          </a>
        </div>
        <div class="flex flex-col p-8 text-xl text-black">
          <div class="flex flex-row items-center gap-x-3">
            <TickIcon />
            <span>All goodness as above</span>
          </div>
          <div class="mt-8 flex flex-row items-center gap-x-3">
            <TickIcon />
            <span>Only Next.js Starter Kit</span>
          </div>
        </div>
      </div>
      <div class="flex flex-row flex-wrap divide-x divide-white/25 border border-gray-100">
        <div class="flex flex-col p-8">
          <span class="ml-1 text-3xl font-semibold text-black/25 line-through">$150</span>
          <span class="ml-1 text-7xl font-bold text-svelte">$75</span>
          <a class="ls-button mt-12" href="https://code-templates.lemonsqueezy.com/buy/b6d0f0d2-7b21-4a13-9a29-0821cf51e1bf">
            <input class="hidden" type="text" name="template" value="sveltekit" />
            <button class="max-w-max -rotate-1 rounded border bg-svelte px-4 py-1 text-xl font-medium text-white"> Get SvelteKit Starter Kit &rarr; </button>
            <a href="https://launchfast-sveltekit.vercel.app/" target="_blank" class="mt-4 block max-w-max -rotate-1 rounded border px-4 py-1 text-xl font-medium text-black">
              View Demo &rarr;
            </a>
          </a>
        </div>
        <div class="flex flex-col p-8 text-xl text-black">
          <div class="flex flex-row items-center gap-x-3">
            <TickIcon />
            <span>All goodness as above</span>
          </div>
          <div class="mt-8 flex flex-row items-center gap-x-3">
            <TickIcon />
            <span>Only SvelteKit Starter Kit</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-row flex-wrap border border-gray-100">
      <div class="flex grow flex-col p-8 md:grow-0">
        <span class="ml-1 text-3xl font-semibold text-black/25 line-through">$450</span>
        <span class="ml-1 inline-block text-7xl font-bold text-black">$199</span>
        <a class="ls-button mt-12" href="https://code-templates.lemonsqueezy.com/buy/c6c9383b-4053-4096-bc4a-30230290bf29">
          <input class="hidden" type="text" name="template" value="bundle" />
          <button class="from-branding inline-block max-w-max -rotate-1 rounded bg-gradient-to-br to-svelte px-4 py-1 text-xl font-medium">
            <span class="text-white">Get The Bundle &rarr;</span>
          </button>
        </a>
      </div>
      <div class="flex grow flex-col p-8 text-xl text-black">
        <div class="flex flex-row items-center gap-x-3">
          <TickIcon />
          <span>All goodness as above</span>
        </div>
        <div class="mt-8 flex flex-row items-center gap-x-3">
          <TickIcon />
          <span>Astro Starter Kit</span>
        </div>
        <div class="mt-8 flex flex-row items-center gap-x-3">
          <TickIcon />
          <span>SvelteKit Starter Kit</span>
        </div>
        <div class="mt-8 flex flex-row items-center gap-x-3">
          <TickIcon />
          <span>Next.js Starter Kit</span>
        </div>
      </div>
    </div>
  </div>
</section>
