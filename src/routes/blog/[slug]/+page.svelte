<script lang="ts">
  import type { PageData } from './$types'
  import type { SvelteComponent } from 'svelte'
  import Author from '@/components/Author.svelte'
  import SocialSharing from '@/components/Social-Sharing.svelte'

  export let data: PageData

  type C = $$Generic<typeof SvelteComponent<any, any, any>>
  $: component = data.component as unknown as C
</script>

<div class="relative mx-auto flex max-w-2xl flex-col px-8 py-8">
  <h1 class="text-3xl font-extrabold text-branding">{data.frontmatter.title}</h1>
  {#if data?.frontmatter?.show_author !== false}
    <div class="flex flex-row items-center justify-between">
      <Author name="Rishi Raj Jain" image="https://ik.imagekit.io/vjeqenuhn/1677584426725_O0mYlJuu_.jpeg" />
      <SocialSharing title={data.frontmatter.title} url={new URL(`/blog/${data.frontmatter.slug}`, 'https://www.launchfa.st').toString()} />
    </div>
  {/if}
  <article class="prose">
    <svelte:component this={component} />
  </article>
  <div class="mt-8 h-[1px] w-full bg-gray-100"></div>
</div>
