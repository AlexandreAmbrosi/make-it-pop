<script lang="ts">
  import { Popover, PopoverContent, PopoverTrigger } from '@/lib/components/ui/popover'
  import { userProfile } from '@/stores'
  import { onMount } from 'svelte'

  onMount(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((res) => {
        userProfile.set(res)
      })
  })
</script>

<div class="relative flex flex-col">
  <Popover>
    <PopoverTrigger>
      <img
        id="user_img"
        loading="lazy"
        decoding="async"
        class="size-8 cursor-pointer rounded-full"
        alt={$userProfile?.name?.toString() || 'User'}
        src={$userProfile?.picture?.toString() || 'https://github.com/shadcn.png'}
      />
    </PopoverTrigger>
    <PopoverContent class="flex max-w-max flex-col px-0">
      {#if $userProfile?.name}
        <span class="px-5 font-medium">{$userProfile.name}</span>
        <span class="mt-1 px-5 text-sm text-gray-400">{$userProfile.email}</span>
      {:else}
        <a class="px-5" href="/signin"> Sign In </a>
      {/if}
      <a class="mt-3 border-t px-5 pt-3" href="/protected"> Protected </a>
      <a class="mt-3 border-t px-5 pt-3" href="/partial_protected_and_paid"> Partial Protected and Paid </a>
      <a class="mt-3 border-t px-5 pt-3" href="/protected_and_paid"> Protected and Paid </a>
      <a class="mt-3 border-t px-5 pt-3" href="/dashboard"> Settings </a>
      {#if $userProfile?.name}
        <a class="mt-3 border-t px-5 pt-3" href="/api/sign/out"> Sign Out </a>
      {/if}
    </PopoverContent>
  </Popover>
</div>
