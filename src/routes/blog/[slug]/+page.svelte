<script lang="ts">
  import type { PageData } from './$types'
  import type { SvelteComponent } from 'svelte'
  import Author from '@/components/Author.svelte'
  import SocialSharing from '@/components/Social-Sharing.svelte'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()

  type C = $$Generic<typeof SvelteComponent<any, any, any>>
  let component = $derived(data.component as unknown as C)

  const SvelteComponent_1 = $derived(component)
</script>

<div data-pagefind-body class="relative mx-auto flex max-w-2xl flex-col px-8 py-8">
  <h1 class="text-3xl font-extrabold text-branding">{data.frontmatter.title}</h1>
  {#if data?.frontmatter?.show_author !== false}
    <div class="flex flex-row items-center justify-between">
      <Author name="Rishi Raj Jain" image="https://ik.imagekit.io/vjeqenuhn/static/headshot.jpeg" />
      <SocialSharing title={data.frontmatter.title} url={new URL(`/blog/${data.frontmatter.slug}`, 'https://www.launchfa.st').toString()} />
    </div>
  {/if}
  <article class="prose">
    <SvelteComponent_1 />
  </article>
  <div class="mt-8 h-[1px] w-full bg-gray-100"></div>
</div>
