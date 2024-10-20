<script lang="ts">
  interface Props {
    title?: string
    description?: string
    url?: string
    image?: string
    preloads?: { as: string; href: string }[]
    icon?: string
    slackPreviewLabels?: { title: string; href: string }[]
  }

  let {
    title = 'LaunchFa.st - Launch your apps in hours with this SvelteKit boilerplate',
    description = 'The SvelteKit, Stripe, TailwindCSS, Resend, Upstash boilerplate with all the stuff you need to get your product in front of customers. Launch your SaaS, AI projects, or web apps from concept to web heck faster with this SvelteKit boilerplate 🚀',
    url = 'https://www.launchfa.st',
    image = 'https://ik.imagekit.io/vjeqenuhn/launchfast-website/seo.png',
    preloads = [],
    icon = 'https://ik.imagekit.io/vjeqenuhn/launchfast-website/purple-icon.png',
    slackPreviewLabels = [],
  }: Props = $props()

  const can = $state(new URL(url))
  can.hostname = 'www.launchfa.st'
</script>

<!-- Global Metadata -->
<meta charset="utf-8" />
<link rel="shortcut icon" href={icon} />
<meta property="og:type" content="website" />
<meta property="og:locale" content="en_US" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
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
