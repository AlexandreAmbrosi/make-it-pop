<script lang="ts">
  import '@/app.css'
  import 'nprogress/nprogress.css'
  import NProgress from 'nprogress'
  import { navigating } from '$app/stores'
  import Footer from '@/components/Footer.svelte'
  import Header from '@/components/Header.svelte'
  import Divider from '@/components/Divider.svelte'
  import { Toaster } from '$lib/components/ui/sonner'
  import LemonSqueezyScript from '@/components/Scripts/LemonSqueezy.svelte'

  $: {
    if ($navigating) NProgress.start()
    else NProgress.done()
  }
</script>

<Toaster />
<Header />
<Divider className="mt-3 border-none" />
<slot />
<Divider className="mt-3 border-none" />
<Footer twitter="rishi_raj_jain_" brand_name="launchfa.st" />
<LemonSqueezyScript />
