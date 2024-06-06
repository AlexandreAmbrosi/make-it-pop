<script lang="ts">
  /*
    A component that can be used anywhere in your app
    
    <Features />
  */

  import { slug } from 'github-slugger'
  import features from '@/lib/data/features'
</script>

<div id="features" class="mx-auto flex max-w-7xl flex-col gap-8 px-8">
  <div class="flex flex-col text-left">
    <a href="/#features" class="text-3xl font-extrabold text-launchfast/75 sm:text-4xl">
      Your Time-Saving <span class="bg-astro whitespace-nowrap px-2 text-white shadow-2xl">Web Development</span> Starter Kit(s)
    </a>
    <p class="mt-3 text-xl text-gray-600">
      Save lot of time using baked-in countless integrations, API Routes, and components to send emails, setup blogs, login users, protect routes, track user events, accept
      payments worldwide, let user upload files, capture waitlists, start supporting customers and more ✨
    </p>
  </div>
  {#each features as feature}
    <a href={`#${slug(feature.heading)}`} id={slug(feature.heading)} class="mt-8 flex flex-col text-left text-2xl font-semibold text-launchfast">
      {feature.heading}
    </a>
    <div class="flex flex-col">
      {#if feature.images}
        <div class={'grid grid-cols-1 grid-rows-1 sm:grid-cols-2 ' + (feature.images.length === 2 ? 'sm:grid-rows-1' : 'sm:grid-rows-2')}>
          {#each feature.images as i, idx}
            <img alt={idx.toString()} src={i} width="1600" height="900" loading="lazy" decoding="async" class={(idx === 0 ? '' : 'hidden sm:block') + ' h-auto w-full'} />
          {/each}
        </div>
      {/if}
      <div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {#each feature.products as benefit}
          <div class="flex flex-col">
            <img alt={benefit.name} class="h-[30px] w-[30px] bg-white" loading="lazy" width="30" height="30" src={benefit.logo} />
            <span class="mt-3 font-bold">{benefit.name}</span>
            {#if benefit.description}
              <span class="text-gray-600">{benefit.description}</span>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>
