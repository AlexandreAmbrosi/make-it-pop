<script lang="ts">
  import { afterNavigate, beforeNavigate } from '$app/navigation'
  import { Toaster } from '$lib/components/ui/sonner'
  import '@/app.css'
  import Divider from '@/components/Divider.svelte'
  import Footer from '@/components/Footer.svelte'
  import Header from '@/components/Header.svelte'
  import LemonSqueezyScript from '@/components/Scripts/LemonSqueezy.svelte'
  import Seo from '@/components/SEO.svelte'
  import NProgress from 'nprogress'
  import 'nprogress/nprogress.css'

  let { children } = $props()

  beforeNavigate(() => NProgress.start())
  afterNavigate(() => NProgress.done())
</script>

<Seo />
<Toaster />
<Header />
<Divider className="mt-3 border-none bg-gray-100" />
{@render children()}
<Divider className="mt-3 border-none bg-gray-100" />
<Footer twitter="rishi_raj_jain_" brand_name="LaunchFast" />
<LemonSqueezyScript />
