<script lang="ts">
  import config from '@/config'

  interface Props {
    url?: string
    icon?: string
    title?: string
    image?: string
    description?: string
    slackPreviewLabels?: { title: string; href: string }[]
    preloads?: { as: 'script' | 'style' | 'font' | 'image'; href: string }[]
  }

  let {
    preloads = [],
    slackPreviewLabels = [],
    url = config.url,
    image = 'https://ik.imagekit.io/vjeqenuhn/launchfast-website/seo.png',
    icon = 'https://ik.imagekit.io/vjeqenuhn/launchfast-website/purple-icon.png',
    title = 'Production-Ready SaaS Starter Kits in Astro, Next.js and SvelteKit',
    description = 'Save countless hours with comprehensive SaaS starter kits, covering SEO, analytics, authentication, payments, and more. Launch your project faster with integrated tools for Astro, Next.js, and SvelteKit, designed to help you focus on building for your customers.',
  }: Props = $props()

  const can = $state(new URL(url))
</script>

<svelte:head>
  <!-- Global Metadata -->
  <meta charset="utf-8" />
  <link rel="shortcut icon" href={icon} />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  <meta http-equiv="x-ua-compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <link rel="canonical" href={can.toString()} />
  <!-- Primary Meta Tags -->
  <title>{title}</title>
  <meta name="title" content={title} />
  <meta name="description" content={description} />
  <!-- Open Graph / Facebook -->
  <meta property="og:title" content={title} />
  <meta property="og:type" content="website" />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:url" content={url} />
  <!-- Twitter -->
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:image" content={image} />
  <meta property="twitter:url" content={url} />
  <!-- Slack Preview Labels -->
  {#each slackPreviewLabels as i, index}
    <meta name={'twitter:label' + (index + 1)} content={i.title} />
    <meta name={'twitter:data' + (index + 1)} content={i.href} />
  {/each}
  <!-- Preload(s) -->
  {#each preloads as i}
    <link rel="preload" as={i.as} href={i.href} />
  {/each}
</svelte:head>
