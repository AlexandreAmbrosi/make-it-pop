<script lang="ts">
  import { afterNavigate, beforeNavigate } from '$app/navigation'
  import { Toaster } from '$lib/components/ui/sonner'
  import '@/app.css'
  import Footer from '@/components/Footer.svelte'
  import Header from '@/components/Header.svelte'
  import Seo from '@/components/SEO.svelte'
  import NProgress from 'nprogress'
  import 'nprogress/nprogress.css'

  let { children } = $props()

  beforeNavigate(() => NProgress.start())
  afterNavigate(() => NProgress.done())
</script>

<Seo />
<Toaster />
<Seo />
<Toaster />
<!-- Removed demo banner -->
<Header />
{@render children()}
<Footer brand_name="Make It Pop" twitter="alexandreambrosi" />
