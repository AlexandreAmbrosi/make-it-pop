<script lang="ts">
  import '@/app.css'
  import Footer from '@/components/Footer.svelte'
  import Header from '@/components/Header.svelte'
  import Divider from '@/components/Divider.svelte'
  import { Toaster } from '$lib/components/ui/sonner'
  import LemonSqueezyScript from '@/components/Scripts/LemonSqueezy.svelte'

  interface Props {
    children?: import('svelte').Snippet
  }

  let { children }: Props = $props()
</script>

<Toaster />
<Header />
<Divider className="mt-3 border-none bg-gray-100" />
{@render children()}
<Divider className="mt-3 border-none bg-gray-100" />
<Footer twitter="rishi_raj_jain_" brand_name="launchfa.st" />
<LemonSqueezyScript />
