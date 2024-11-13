<script lang="ts">
  import type { PageData } from './$types'
  import type { SvelteComponent } from 'svelte'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()

  type C = $$Generic<typeof SvelteComponent<any, any, any>>
  let component = $derived(data.component as unknown as C)

  const SvelteComponent_1 = $derived(component)
</script>

<div data-pagefind-body class="flex flex-col">
  <h1 class="max-w-max text-3xl font-extrabold text-branding sm:text-4xl">{data.frontmatter.title}</h1>
  <h2 class="mt-3 text-gray-400">{data.frontmatter.description}</h2>
  <article class="prose min-w-full">
    <SvelteComponent_1 />
  </article>
</div>
