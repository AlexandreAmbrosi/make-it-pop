<script lang="ts">
  // Use the value returned by +page.server.ts
  export let data
</script>

<div class="relative mx-auto flex max-w-7xl flex-col px-8 py-8">
  {#if data.session}
    <h1 class="pb-6 text-3xl font-medium text-launchfast">Logged In!</h1>
  {:else}
    <h1 class="pb-6 text-3xl font-medium text-launchfast">Not logged in.</h1>
  {/if}
  {#if data.paid}
    <h1 class="pb-6 text-3xl font-medium text-launchfast">Paid!</h1>
  {:else}
    <h1 class="pb-6 text-3xl font-medium text-launchfast">Not paid.</h1>
  {/if}
</div>
