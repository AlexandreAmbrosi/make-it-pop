<script lang="ts">
  import Seo from '@/components/SEO.svelte'
  import type { PageData } from './$types'
  import ForgotPasswordComponent from '@/components/Forgot-Password.svelte'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
</script>

<Seo title={'Forgot Password'} />

<div class="w-full py-8 lg:grid lg:min-h-[600px] lg:grid-cols-2">
  <div class="flex items-center justify-center py-12">
    <div class="mx-auto grid w-[350px] gap-6">
      <div class="grid gap-2">
        <h1 class="text-3xl font-bold">Forgot Password?</h1>
      </div>
      <ForgotPasswordComponent {...data} />
    </div>
  </div>
  <div class="hidden lg:block">
    <img
      alt="Finder"
      width="4000"
      height="6000"
      loading="lazy"
      decoding="async"
      class="h-[90vh] w-full object-cover"
      src="https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg"
    />
  </div>
</div>
