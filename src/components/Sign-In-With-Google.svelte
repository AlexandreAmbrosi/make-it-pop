<script lang="ts">
  /*
    A component that can be used anywhere in your app
    to let user sign in from Google

    <SignInWithGoogle />
  */

  import IconGoogle from 'virtual:icons/devicon/google'
</script>

<a href="/api/auth/google">
  <button
    type="button"
    class="inline-flex h-10 w-full items-center justify-center gap-x-3 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  >
    <IconGoogle />
    <p>Continue with Google</p>
  </button>
</a>
