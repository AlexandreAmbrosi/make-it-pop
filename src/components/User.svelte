<script lang="ts">
  import { Popover, PopoverContent, PopoverTrigger } from '@/lib/components/ui/popover'
  import { userProfile } from '@/stores'
  import { onMount } from 'svelte'

  onMount(() => {
    fetch('/auth/session')
      .then((res) => res.json())
      .then((res) => {
        if (res?.user) userProfile.set(res.user)
      })
  })
</script>

<div class="relative flex flex-col">
  {#if $userProfile?.email}
    <Popover>
      <PopoverTrigger>
        {#if $userProfile?.image}
          <img
            id="user_img"
            decoding="async"
            class="size-8 cursor-pointer rounded-full"
            alt={$userProfile?.name?.toString() || 'User'}
            src={$userProfile?.image?.toString() || 'https://github.com/shadcn.png'}
          />
        {:else if $userProfile?.name}
          <span class="rounded-full border p-2 text-sm">
            {$userProfile.name
              .split(' ')
              .map((i) => i[0])
              .join('')}
          </span>
        {/if}
      </PopoverTrigger>
      <PopoverContent class="flex max-w-max flex-col px-0">
        {#if $userProfile?.name}
          <span class="px-5 font-medium">{$userProfile.name}</span>
        {/if}
        <span class="mt-1 px-5 text-sm text-gray-400">{$userProfile.email}</span>
        <a class="mt-3 border-t px-5 pt-3" href="/protected"> Protected </a>
        <a class="mt-3 border-t px-5 pt-3" href="/partial_protected_and_paid"> Partial Protected and Paid </a>
        <a class="mt-3 border-t px-5 pt-3" href="/protected_and_paid"> Protected and Paid </a>
        <a class="mt-3 border-t px-5 pt-3" href="/dashboard"> Settings </a>
        <a class="mt-3 border-t px-5 pt-3" href="/auth/signout"> Sign Out </a>
      </PopoverContent>
    </Popover>
  {:else}
    <a class="rounded border bg-black px-3 py-1 text-sm text-white" href="/signin">Sign in</a>
  {/if}
</div>
