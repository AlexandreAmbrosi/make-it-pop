<script lang="ts">
  /*
    A component that can be used anywhere in your app
    to let user sign in from Twitter

    <SignInWithTwitter />
  */

  import IconTwitter from 'virtual:icons/devicon/twitter'
</script>

<a href="/api/auth/twitter">
  <button
    type="button"
    class="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 w-full items-center justify-center gap-x-3 rounded-md border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
  >
    <IconTwitter />
    <p>Continue with Twitter</p>
  </button>
</a>
