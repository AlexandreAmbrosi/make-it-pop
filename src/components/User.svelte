<script lang="ts">
  import { page } from '$app/stores'
  import { PopoverTrigger, Popover, PopoverContent } from '@/lib/components/ui/popover'

  $: session = $page.data.session
</script>

{#if $page.data.disableUser !== true}
  <div class="relative flex flex-col">
    <Popover>
      <PopoverTrigger>
        <img
          id="user_img"
          loading="lazy"
          decoding="async"
          alt={session?.name?.toString() || 'User'}
          class="size-8 cursor-pointer rounded-full"
          src={session?.picture?.toString() || 'https://github.com/shadcn.png'}
        />
      </PopoverTrigger>
      <PopoverContent class="flex max-w-max flex-col px-0">
        {#if session}
          <span class="px-5 font-medium">{session.name}</span>
          <span class="mt-1 px-5 text-sm text-gray-400">{session.email}</span>
          <a class="mt-3 border-t px-5 pt-3" href="/protected"> Protected </a>
          <a class="mt-3 border-t px-5 pt-3" href="/partial_protected_and_paid"> Partial Protected and Paid </a>
          <a class="mt-3 border-t px-5 pt-3" href="/protected_and_paid"> Protected and Paid </a>
        {/if}
        <a class={['px-5', session && 'mt-3 border-t pt-3'].join(' ')} href={session ? '/api/sign/out' : '/signin'}>
          Sign {session ? 'Out' : 'In'}
        </a>
      </PopoverContent>
    </Popover>
  </div>
{/if}
