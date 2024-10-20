<script lang="ts">
  import type { PageData } from './$types'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
</script>

<div class="relative mx-auto flex max-w-7xl flex-col px-8 py-8">
  {#if data.session}
    <h1 class="pb-6 text-3xl font-medium text-launchfast">Logged In</h1>
  {:else}
    <h1 class="pb-6 text-3xl font-medium text-launchfast">Not Logged In</h1>
  {/if}
  {#if data.paid}
    <h1 class="pb-6 text-3xl font-medium text-launchfast">Paid</h1>
  {:else}
    <h1 class="pb-6 text-3xl font-medium text-launchfast">Not Paid</h1>
  {/if}
</div>
