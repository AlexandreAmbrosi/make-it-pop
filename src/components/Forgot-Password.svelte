<script lang="ts">
  interface Props {
    code: any
    validCode: any
  }

  let { code, validCode }: Props = $props()
</script>

<form class="flex flex-col" action="/api/sign/forgot" method="POST">
  <label class="mb-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="email">Email address</label>
  {#if code}
    <input id="code" name="code" class="hidden" value={code} />
  {/if}
  {#if validCode}
    <input
      required
      id="email"
      name="email"
      type="email"
      autocomplete="email"
      value={`${validCode}`}
      placeholder="m@example.com"
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  {:else}
    <input
      required
      id="email"
      name="email"
      type="email"
      autocomplete="email"
      placeholder="m@example.com"
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  {/if}
  {#if validCode}
    <label for="password" class="mt-5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"> Password </label>
    <input
      required
      id="password"
      name="password"
      type="password"
      autocomplete="off"
      class="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  {/if}
  <button
    type="submit"
    class="mt-5 inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  >
    {#if validCode}
      Reset Password
    {:else}
      Send
    {/if}
  </button>
</form>
