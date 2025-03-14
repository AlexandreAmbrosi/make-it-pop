<script lang="ts">
  import Seo from '@/components/SEO.svelte'
  import type { PageData } from './$types'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
</script>

<Seo title={'Blog'} description={'Latest news and updates from Company'} />

<div class="relative mx-auto flex max-w-7xl flex-col px-8 py-4">
  <h1 class="mt-4 max-w-max text-3xl font-extrabold text-black sm:text-4xl">Changelog</h1>
  <h2 class="mt-4 text-gray-400">Stay up to date with the latest changes in our product.</h2>
  <div class="mt-12 h-[1px] w-full bg-black/5"></div>
  <div class="mt-4 rounded-md bg-amber-50 p-4">
    <p class="text-red-800">
      This is not the official changelog of LaunchFast. Check out the <a
        target="_blank"
        href="https://www.launchfa.st/documentation/guides/introduction"
        class="text-red-900 underline hover:text-red-700">official changelog here</a
      >.
    </p>
  </div>
  <article class="prose prose-gray mt-12 w-full">
    {@html data.changelog[0].mdx}
  </article>
</div>
