<script lang="ts">
  /*
    A component that can be used anywhere in your app
    to let user sign in from Twitter

    <SignInWithTwitter />
  */

  import IconTwitter from './Icon-Twitter.svelte'
</script>

<a href="/api/auth/twitter">
  <button type="button" class="flex h-10 items-center gap-x-2 rounded-md border px-12 transition duration-300 hover:border-black">
    <IconTwitter />
    <p>Continue with Twitter</p>
  </button>
</a>
